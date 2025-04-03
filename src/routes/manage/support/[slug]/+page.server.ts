import { logAuditChange } from '$lib/server/AuditLogger';
import { del, verifyAndGetUser } from '$lib/server/Backend';
import { check_TicketsRW_Access } from '$lib/server/BackendAdmin';
import { deleteTicket, getTicketByTicketID, setTicketStatus } from '$lib/server/BackendAgentSupport.js';
import { getUserId, getUserInfo } from '$lib/server/BackendAgentUser.js';
import { generateChecksum } from '$lib/server/CacheMaster';
import { getUserObjectFromJWT } from '$lib/server/GAuth.js';
import { fail } from '@sveltejs/kit';


const passIDToName = {
    "9iiwEUtZSz2052dd6S0wzw": "MAHE Dual (2 in 1)",
    "T615OpoVROuHP5M7ghpPfA": "MAHE Single (with Esports)",
    "ra0n29JFQgyzZ7mNygqf0g": "Robotics",
    "zICPq1hQRc2wQjZaA1ZsoQ": "Technical",
    "v-ETvSgxQ_KYcDQpj-BHBA": "All access Non-MAHE",
    "Pi036rnfQni-tknGiM4qQg": "Technical + e-Sports",
    "UAhZyBzOQm6uzfhkoS_UtQ": "Finance",
    "PsbyLPvtR6m5SfgjNChg8Q": "Esports",
    "ALryBwdJS-yJm1zosXzUHQ": "MAHE Dual (2 in 1) (with Esports)",
    "mJY2B-iLTVG20fpz_Om0hg": "MAHE Single"
}

export async function load({ cookies, params }) {
    const userJson = cookies.get('userInfo');
    const checksum = cookies.get('userChecksum');
    const access = await check_TicketsRW_Access(cookies.get('authToken'), userJson, checksum);
    if (userJson == null || checksum == null) {
        const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
        if (user.result != null) {
            cookies.set('userInfo', JSON.stringify(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/"
            });
            cookies.set('userChecksum', generateChecksum(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/"
            });
        }
    }
    if (access == false) { return fail(403, { err: 'You do not have access to view/modify tickets!' }); }
    if (params.slug == null) { return fail(404, { err: 'Ticket id cannot be null!' }); }
    const ticket = await getTicketByTicketID(params.slug);
    if (ticket == null) { return fail(404, { err: 'Ticket with that ID does not exist!' }); }

    const userID = await getUserId(ticket.email_address);
    if (userID == null) { return fail(404, { err: 'Author does not exist' }); }

    const userInfo = await getUserInfo(userID);
    if (userInfo == null) { return fail(404, { err: 'Author invalid' }); }


    return { ticket: ticket, userInfo: userInfo, passName: userInfo?.pass_id == null ? "No pass" : passIDToName[userInfo?.pass_id as string] }
}

export const actions = {
    solve: async ({ cookies, request, params }) => {
        try {
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const access = await check_TicketsRW_Access(cookies.get('authToken'), userJson, checksum);
            if (userJson == null || checksum == null) {
                const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
                if (user.result != null) {
                    cookies.set('userInfo', JSON.stringify(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 3600
                    });
                    cookies.set('userChecksum', generateChecksum(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 3600
                    });
                }
            }
            const user = getUserObjectFromJWT(cookies.get('authToken') as string)
            if (access == false) { return fail(403, { err: 'You do not have authority to solve tickets!' }); }
            const ticketID = params?.slug;
            if (ticketID == null) { return fail(400, { err: 'Invalid url!' }) }
            const form = await request.formData();
            if (form == null) { return fail(400, { err: 'No form!' }); }
            const comment = form.get('comment');
            const solved = form.get('solved');
            if (comment == null) { return fail(400, { err: 'No comment!' }); }
            const subRes = await setTicketStatus(ticketID, solved == 'on', comment as string, user.email);

            await logAuditChange({ action: "UPDATE", table_name: 'ticket', user_email: user.email, record_id: params.slug, new_data: { solveld: solved == 'on', comment: comment } });

            return { msg: subRes.suc ? "Submitted successfully" : subRes.err }
        }
        catch (ex) {
            return fail(503, { err: `Service request failed: ${ex}` })
        }
    },
    delete: async ({ cookies, params }) => {
        try {
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const access = await check_TicketsRW_Access(cookies.get('authToken'), userJson, checksum);
            if (userJson == null || checksum == null) {
                const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
                if (user.result != null) {
                    cookies.set('userInfo', JSON.stringify(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 3600
                    });
                    cookies.set('userChecksum', generateChecksum(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 3600
                    });
                }
            }
            const guser = getUserObjectFromJWT(cookies.get('authToken') as string);
            const res = await deleteTicket(params.slug);
            await logAuditChange({ action: "DELETE", table_name: 'ticket', user_email: guser.email, record_id: params.slug });

            return { msg: res.success ? "Deleted successfully" : res.error }

        } catch (ex) {
            return fail(503, { err: `Service request failed: ${ex}` })
        }
    }
}