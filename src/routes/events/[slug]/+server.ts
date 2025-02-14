import { addUserToTeam, createTeam, deleteTeam } from '$lib/components/backend/BackendAgentTeam';
import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { UserProfileData } from '../../GoogleLogin.svelte.ts';

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const { teamName } = await request.json();
        
        // Call your createTeam function here
        const team = await createTeam(teamName, UserProfileData.userID);
        
        
        return json({ success: true, team });
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            // error: error.message 
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};


export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const { teamId } = params; 

        if (!teamId) {
            throw new Error('Missing team ID');
        }

        const deletedTeam = await deleteTeam(teamId);

        if (!deletedTeam) {
            throw new Error('Failed to delete team');
        }

        return json({ success: true, team: deletedTeam });
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};


export const PUT: RequestHandler = async ({ request, params }) => {
    try {
        const { userId, memberName } = await request.json();
        const { teamId } = params;  // Get teamId from params directly

        if (!teamId || !userId) {
            throw new Error('Missing required parameters: teamId or userId');
        }

        console.log("Attempting to add user to team:", { teamId, userId, memberName });  //logging

        const updatedTeam = await addUserToTeam(teamId, userId);

        if (!updatedTeam) {
            throw new Error('Failed to add user to team');
        }

        console.log("Successfully added user to team:", updatedTeam);  //  logging

        return json({ success: true, team: updatedTeam });
    } catch (error) {
        console.error("Error in PUT handler:", error);  // error logging
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};