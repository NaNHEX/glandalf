import * as cheerio from 'cheerio';
import axios from 'axios';

export async function getValidatedComps(spe, proj, cookie) {
    const gandalfCookie = cookie;
    const gandalfCompPage = await axios.get(
        'https://gandalf.epitech.eu/local/graph/view.php', 
        { 
            headers: { Cookie: `MoodleSession=${gandalfCookie};` }
        }
    );

    const $ = cheerio.load(gandalfCompPage.data);
    const validatedComps = [];
    $('div.behaviorLine').each((i, div) => {
        const comp = $(div).children('.competencyTitle').text().trim();
        const status = $(div).children('.proficiencyIcon').attr('title').trim(); // unrated, failed, success

        if(status === 'success') {
            validatedComps.push({ 'behaviorCode': comp.split('-')[0].trim(), 'behaviorText': comp.split('-')[1].trim() });
        }
    });

    return validatedComps;
}