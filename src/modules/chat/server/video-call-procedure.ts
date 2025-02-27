import { createTRPCRouter, protectedProcedure } from "@/app/trpc/init";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { v4 as uuid4 } from "uuid";

const HMS_API_KEY = process.env.HMS_API_KEY;
const HMS_API_SECRET = process.env.HMS_APP_SECRET;

if (!HMS_API_KEY || !HMS_API_SECRET) {
    throw new Error("HMS_API_KEY and HMS_API_SECRET must be set in the environment variables.");
}

// Function to generate a management token
const generateManagementToken = () => {
    const payload = {
        access_key: HMS_API_KEY, // Your app access key
        type: 'management', // Token type
        version: 2, // Token version
        iat: Math.floor(Date.now() / 1000), // Issued at (current time in seconds)
        nbf: Math.floor(Date.now() / 1000)  // Not before (current time in seconds)
    };

    // Sign the JWT
    const token = jwt.sign(
        payload,
        HMS_API_SECRET,
        {
            algorithm: 'HS256', // Signing algorithm
            expiresIn: '24h', // Token expires in 24 hours
            jwtid: uuid4() // Unique JWT ID
        }
    );

    return token;
};

export const videoCallRouter = createTRPCRouter({
    // Create a new video room
    createRoom: protectedProcedure
        .input(z.object({ appointmentId: z.string() }))
        .mutation(async ({ input }) => {
            try {
                console.log("HMS_API_KEY", HMS_API_KEY);

                // Generate management token
                const managementToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDA2NjIwNjUsImV4cCI6MTc0MTI2Njg2NSwianRpIjoiZTcxZTc4OWItZGI2OS00OGJjLWFkZWMtNmMwNTNmODk0MGJlIiwidHlwZSI6Im1hbmFnZW1lbnQiLCJ2ZXJzaW9uIjoyLCJuYmYiOjE3NDA2NjIwNjUsImFjY2Vzc19rZXkiOiI2N2MwNWU2NzMzY2U3NGFiOWJlOTU1YWQifQ.Zz447rCaWK2HWQym_cJBiRXeezg7n1G4vlTVJOlDnuU";
                // generateManagementToken();

                // Create a room with 100ms API
                const response = await fetch("https://api.100ms.live/v2/rooms", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${managementToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: `appointment-${input.appointmentId}`,
                        description: `Video call for appointment ${input.appointmentId}`,
                        template_id: "67c05e738102660b706af2e8" // Use your template ID
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("100ms room creation error:", errorData);
                    throw new Error("Failed to create 100ms room");
                }

                const room = await response.json();
                return {
                    id: room.id,
                    name: room.name
                };
            } catch (error: any) {
                console.error(error);
                console.log(error.stack);
                throw error;
            }
        }),

    // Generate a token for joining a room
    generateToken: protectedProcedure
        .input(z.object({
            roomId: z.string(),
            userId: z.string(),
            role: z.string().default("host") // host, guest, etc.
        }))
        .mutation(async ({ input }) => {
            try {
                // Generate management token
                const managementToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDA2NjIwNjUsImV4cCI6MTc0MTI2Njg2NSwianRpIjoiZTcxZTc4OWItZGI2OS00OGJjLWFkZWMtNmMwNTNmODk0MGJlIiwidHlwZSI6Im1hbmFnZW1lbnQiLCJ2ZXJzaW9uIjoyLCJuYmYiOjE3NDA2NjIwNjUsImFjY2Vzc19rZXkiOiI2N2MwNWU2NzMzY2U3NGFiOWJlOTU1YWQifQ.Zz447rCaWK2HWQym_cJBiRXeezg7n1G4vlTVJOlDnuU";

                // Generate auth token for the user
                const authTokenResponse = await fetch("https://api.100ms.live/v2/room-codes/auth-token", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${managementToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        room_id: input.roomId,
                        user_id: input.userId,
                        role: input.role,
                        user_name: `user-${input.userId.substring(0, 8)}`
                    })
                });

                // Log the raw response for debugging
                const rawResponse = await authTokenResponse.text();
                console.log("Raw API Response:", rawResponse);

                if (!authTokenResponse.ok) {
                    // Try to parse the error response as JSON
                    let errorResponse;
                    try {
                        errorResponse = JSON.parse(rawResponse);
                    } catch (e) {
                        errorResponse = rawResponse; // Fallback to raw response if JSON parsing fails
                    }
                    console.error("Error generating auth token:", errorResponse);
                    throw new Error("Failed to generate 100ms auth token");
                }

                // Parse the successful response as JSON
                const authToken = JSON.parse(rawResponse);
                return {
                    token: authToken.token
                };
            } catch (error: any) {
                console.error(error);
                throw error;
            }
        }),
});