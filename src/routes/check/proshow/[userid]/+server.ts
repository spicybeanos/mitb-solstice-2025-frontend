import { displayDateTime } from '$lib/components/DisplayTime.js';
import { getUserInfo } from '$lib/server/BackendAgentUser.js';
import { addProshowBand, getProshowBand } from '$lib/server/BandDistribution';
import { getAuthenticatorRights, getBandDistributionEnabled, getBandPasses, validateToken } from '$lib/server/CheckerUser';
import { fail, json, text } from '@sveltejs/kit';


export async function GET({ request, params }) {
    return json({ error: 'Service stopped' }, { status: 503 });
    try {
        const header = request.headers.get('Authorization');
        const token = header?.split(' ')[1];

        if (token == undefined || token == null) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const valid = await validateToken(token);
        if (!valid) { return json({ error: 'Invalid token' }, { status: 403 }); }

        const get = await getProshowBand(params.userid);

        if (get.success == false) { return json({ error: get.error }, { status: 400 }) }
        if (get.result == null) { return json({ error: "User not in band list" }, { status: 404 }) }

        return json({ entry: get.result }, { status: 200 });

    } catch (ex) {
        return json({ error: JSON.stringify(ex) }, { status: 500 });
    }
}

export async function POST({ request, params }) {
    return json({ error: 'Service stopped' }, { status: 503 });
    try {
        const header = request.headers.get('Authorization');
        const token = header?.split(' ')[1];

        if (token == undefined || token == null) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const valid = await validateToken(token);
        if (!valid) { return json({ error: 'Invalid token' }, { status: 403 }); }

        const rights = await getAuthenticatorRights(token);
        if(rights.result != 'cut'){
            return json({ error: 'You do not have permission to cut tickets' }, { status: 400 });
        }

        const get = await getProshowBand(params.userid);
        if (get.success == false) { return json({ error: `Database error when getting ${get.error}` }, { status: 500 }) }
        if (get.result != null) { return json({ error: `User has already been given a band by ${get.result.given_by} at time ${get.result.time}` }, { status: 409 }); }

        const allowed = await getBandDistributionEnabled();

        if (allowed.result == null) { return json({ error: `Could not get bandAdmissionStatus` }, { status: 500 }); }
        if (allowed.result == false) { return json({ error: `Band admission isn't enabled yet` }, { status: 400 }); }

        let canUserBeAdmittes = false;
        const requiredPasses = await getBandPasses();
        if (requiredPasses.result == null) { return json({ error: `Could not get bandPasses` }, { status: 500 }); }
        if (requiredPasses.result.length > 0) {
            const userInfo = await getUserInfo(params.userid);
            if (userInfo == null) { return json({ error: "User does not exist" }, { status: 400 }) }
            for (const p of requiredPasses.result) {
                if (p == userInfo.pass_id) {
                    canUserBeAdmittes = true;
                }
            }
        }
        else {
            canUserBeAdmittes = true;
        }

        if(!canUserBeAdmittes) {return json({error:`User does not have the required pass`},{status:409})}

        const givenBy = token.split('@')[0];
        const time = new Date().toISOString()
        const adding = await addProshowBand({ given_by: givenBy, time: time, user_id: params.userid });

        if (adding.error != null) { return json({ error: `Database error when adding ${adding.error}` }, { status: 500 }) }

        return json({ added_by: givenBy }, { status: 200 })
    } catch (exc) {
        return json({ error: JSON.stringify(exc) }, { status: 500 })
    }
}