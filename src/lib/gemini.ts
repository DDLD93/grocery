import { GoogleGenerativeAI } from "@google/generative-ai";

// check if the api key is set
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}
console.log('GEMINI_API_KEY', import.meta.env.VITE_GEMINI_API_KEY);
// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');


// Create a reusable chat model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Helper to convert our roles to Gemini roles
const convertRole = (role: 'user' | 'assistant'): 'user' | 'model' => {
  return role === 'assistant' ? 'model' : 'user';
};

export const geminiChat = async (
  messages: { role: 'user' | 'assistant'; content: string }[],
  context: {
    cartItems?: any[];
    userPreferences?: string[];
  } = {},
  onStream?: (chunk: string) => void
) => {
  try {
    // Start a chat session
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: convertRole(msg.role),
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7,
      },
    });

    // Prepare context for the AI
    let contextPrompt = "You are a helpful shopping assistant. Format your responses in markdown when appropriate. ";
    if (context.cartItems?.length) {
      contextPrompt += `Current cart items: ${context.cartItems.map(item =>
        `${item.name} (${item.quantity}x)`).join(', ')}. `;
    }
    if (context.userPreferences?.length) {
      contextPrompt += `User preferences: ${context.userPreferences.join(', ')}. `;
    }

    // Get streaming response from the model
    const result = await chat.sendMessageStream(contextPrompt);

    let fullResponse = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      onStream?.(fullResponse);
    }

    return fullResponse;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

export const search = async (query: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: "Your are asistant , you convert name of grocieries in form local nigerian languages and dialete to sigle item name from given context english,\n>>Example {userpropmt : i need something starchy , response : yam}<<\nyour final answer should only come from this table for context {{S/N\tEnglish Name\tIgbo\tHausa\tYoruba\tFulfulde\tKanuri\tTiv\tEfik\tIbibio\tNupe\tIjaw\tGwari (Gbagyi)\tEdo\tUrhobo\n1\tRice\tOsikapa\tShinkafa\tIresi\tMisri\tMasr\tUgun\tEdesi\tEdesi\tEba\tOfari\tEgan\tEran\tOrogba\n2\tBeans\tAgwa\tWake\tEwa\tNyiiri\tWanka\tItyu\tAfia\tAfia\tEkpe\tBibite\tEmwe\tEwa\tEwa\n3\tMaize (Corn)\tOka\tMasara\tAgbado\tGala\tNgilwe\tVanger\tIkpa\tIkpa\tGbangi\tAma\tWuo\tOkpa\tOka\n4\tYam\tJi\tDoya\tIsu\tTeba\tIdo\tItyon\tUbie\tUbie\tEzhi\tTame\tGudu\tIsu\tOya\n5\tCassava\tAkpụ\tRogo\tEge\tRogo\tBerberi\tMchamegh\tIwa\tIwa\tEba\tTubu\tOgo\tUsi\tIbobo\n6\tPlantain\tỌgede\tAyaba\tOgede\tKamba\tKumba\tMbav\tIwop\tIwop\tEde\tKobiri\tKobo\tOghede\tEbobo\n7\tBanana\tUnere\tAyaba\tOgede wewe\tKamba dookai\tKumba Kura\tMbav ga\tEfombu\tEfombu\tEde mizi\tKobiri ti\tKobo mini\tEran di\tUnere\n8\tPalm Oil\tMmanụ nkwu\tMai ja\tEpo pupa\tTanyel\tLalle\tMimba\tEdikang\tEdikang\tTunya\tTupiri\tKopi\tUramo\tEmu\n9\tGroundnut\tAkị hausa\tGyada\tEpa\tKantu\tKwarji\tIbough\tUto\tUto\tGondi\tTei\tZhibi\tOmoka\tEpa\n10\tMelon Seed\tEgwusi\tAgushi\tEgusi\tBeli\tBeli\tGenger\tIkon\tIkon\tZuru\tKeme\tKolo\tIgwe\tEgusi\n11\tOkra\tỌkụrụ\tKubewa\tIla\tWulere\tKalwa\tUgbe\tEfere\tEfere\tIkyan\tOmodu\tBe\tIhan\tOkro\n12\tGarden Egg\tAnyara\tDanyaradawa\tIgba\tManjoka\tGargajiya\tUzungu\tEka\tEka\tShita\tFufou\tPe\tOse\tEba\n13\tTomatoes\tTomati\tTumatur\tTomati\tTumatira\tKumagwa\tNumama\tNdidip\tNdidip\tKutu\tUmor\tLemba\tEkha\tTomati\n14\tPepper\tOse\tBarkono\tAta\tHoore\tNgalbele\tGbande\tEfere\tEfere\tUdan\tIbibiri\tPo\tEba\tAta\n15\tOnion\tYabasi\tAlbasa\tAlubosa\tBasal\tKuskura\tBenge\tIbokun\tIbokun\tAgbalu\tOmia\tBebo\tUsen\tAlubosa\n16\tGarlic\tAya\tTafarnuwa\tAyu\tAfu\tTafa\tDya\tAwot\tAwot\tZwa\tOmia mini\tWa\tAfuo\tAyu\n17\tGinger\tJinja\tCitta\tJinja\tJhanda\tCitta\tDya\tAwot\tAwot\tZwa\tBeni\tWa\tAfuo\tAyu\n18\tCarrot\tKarọọtụ\tKarota\tKarooti\tKaari\tKaroti\tGirin\tEkarot\tEkarot\tKacha\tKeiye\tPupu\tEka\tKaroti\n19\tCucumber\tKukumba\tGurjiya\tKankan Abaro\tYoryo\tJinjama\tIkyen\tIyong\tIyong\tKacha\tBeke\tWe\tOye\tKukumba\n20\tPawpaw\tOkwuru bekee\tGwanda\tIbepe\tBota\tGwanda\tKor\tIkwok\tIkwok\tLaka\tBatei\tKoyo\tEron\tIbepe\n21\tOrange\tỌrangị\tLemun tsami\tOsan\tPore\tLemo\tKor\tNdip\tNdip\tLemo\tOmia\tPeku\tUkpe\tOsan\n22\tMango\tMangolo\tMangwaro\tMangoro\tMangule\tMangoro\tTange\tEfok\tEfok\tWiyo\tNkaka\tPeku\tEmi\tMangoro\n23\tPineapple\tỌnụnụ\tAbarba\tOpe oyinbo\tGundu\tAbarba\tUdandua\tEpop\tEpop\tWasa\tPuru\tPuru\tEmila\tOpe oyibo\n24\tGuava\tGova\tGoba\tGoba\tGayaba\tGoba\tMbav goba\tMfe\tMfe\tMebere\tMbop\tMbop\tGuabe\tGoba\n25\tCoconut\tAku oyibo\tKwakwa\tAgbon\tKorbo\tKwakwa\tIjoko\tAkot\tAkot\tKoto\tWowo\tOwowo\tEde\tAgbon\n26\tSweet Potato\tJi ọjọọ\tDankali mai zaki\tAnamo\tWaina\tZangari\tYange\tEdip-owo\tEdip-owo\tLobo\tOrina\tKwako\tIhu\tEdame\n27\tIrish Potato\tJi bekee\tDankali\tAnamo oyinbo\tDankali\tDankali\tYange oyibo\tEdip-oyinbo\tEdip-oyinbo\tLobo tunchi\tOrina oyibo\tKwako oyibo\tIhu oyibo\tEdame oyibo\n28\tSorghum\tOkili\tDawa\tOka baba\tNyaari\tNgille\tIkyume\tAfia\tAfia\tEbo\tOgbolo\tKwaki\tEbie\tOka baba\n29\tMillet\tJiko\tGero\tOka\tLiri\tNgelle\tIkyume\tAfia\tAfia\tKunchi\tOfari\tKpako\tEgiele\tOka\n30\tSoybeans\tOka bekee\tWaken soya\tAwusa\tSoya\tSoya\tAgashi\tEdeh\tEdeh\tBeni\tOmene\tTukpo\tAvbiose\tEsagwe\n31\tTiger Nut\tAki Hausa\tAya\tOfio\tAya\tAya\tNyian\tIbong\tIbong\tLobo aya\tOmor\tSanu\tEsu\tOfio\n32\tBitter Leaf\tOnugbu\tShuwaka\tEwuro\tChanyel\tKiya\tAtoon\tAtop\tAtop\tFeko\tKono\tNupe\tOse\tEwuro\n33\tWater Leaf\tMgbolodi\tAlayyafoo\tGbure\tBoloh\tZakuwa\tUgbogh\tMfang\tMfang\tShingbe\tBeke\tNufu\tMiro\tGbure\n34\tScent Leaf\tNchanwu\tDodoya\tEfirin\tChaka\tGwaza\tAhihyi\tNtong\tNtong\tTsun\tKeme\tNupe\tOwie\tEfinrin\n35\tFluted Pumpkin Leaf\tUgu\tKabewa\tUgwu\tNdiyel\tGwanda\tIkyaor\tIkwok\tIkwok\tGwagba\tFufou\tGwagba\tUwai\tUghwo\n36\tAfrican Star Apple\tUdala\tAgwaluma\tAgbalumo\tUdala\tGwanu\tAkua\tOkpe\tOkpe\tBogi\tKoko\tKwakwi\tOghele\tOtien\n37\tSugarcane\tỌkpa ọsisi\tReke\tIreke\tLaare\tReke\tUkande\tOkono\tOkono\tSunkwa\tBeris\tFankwe\tEbo\tIreke\n38\tCoconut Oil\tMmanụ aku\tMan kwakwa\tOmi agbon\tTanaku\tKwakwa\tItyem\tIkpo\tIkpo\tEtuku\tFari\tGwagba\tEdo\tEmi agbon\n39\tGroundnut Oil\tMmanụ akị hausa\tMan gyada\tEpo epa\tTanpa\tGyada\tMimba\tEdikang\tEdikang\tTunya\tTupiri\tKopi\tUramo\tEpo epa\n40\tPalm Kernel Oil\tMmanụ akị nkwu\tMan rake\tAdin\tTannaku\tRake\tMimba\tNdikang\tNdikang\tTekpe\tTupiri\tKopi\tEde\tAdin\n41\tSnail\tEjula\tKunama\tIgbin\tKumbu\tKokari\tYongo\tAkpati\tAkpati\tBatako\tBuburu\tKpoko\tEbiyo\tIgbin\n42\tPeriwinkle\tỊsa\tGishiri ruwa\tIsawuru\tDumi\tZakari\tIgyange\tEnyin\tEnyin\tKukwa\tBiri\tPeku\tOza\tIsawuru\n43\tGoat Meat\tAnụ ewu\tNama akuya\tEran ewure\tNamaku\tBarka\tMku\tUkod\tUkod\tMbiyaki\tBibi\tKutu\tIrhie\tEran ewure\n44\tBeef\tAnụ ehi\tNama shanu\tEran malu\tNamshanu\tBako\tMku\tUkod\tUkod\tNyanko\tBibi\tKuji\tOgie\tEran malu\n45\tChicken\tỌkụkọ\tKaji\tAdiye\tKaza\tKaji\tMkem\tIkod\tIkod\tKikina\tIbeku\tWando\tOkhuo\tAdie\n46\tTurkey\tTurki\tTaliyan kaza\tTọki\tKaza Turki\tKaza Turki\tMkem turki\tIkod turki\tIkod turki\tKikina turki\tIbeku turki\tWando turki\tOkhuo turki\tTọki\n47\tFish\tAzụ\tKifi\tEja\tJirgi\tKifi\tMkem\tUdok\tUdok\tNkaku\tKifi\tKifi\tUzokun\tEja\n48\tMilk\tMmiri ara ehi\tMadara\tWara\tNyebe\tMadara\tNyanga\tUkara\tUkara\tMiriki\tBani\tGwana\tOyia\tWara\n49\tHoney\tMmanụ nri nri\tZuma\tOyin\tNyibe\tZuma\tIorhem\tUnam\tUnam\tGungu\tBani\tBanza\tOyia\tOyin\n50\tButter\tBọta\tMan shanu\tBọọsi\tBotaga\tMan shanu\tNyibol\tUbe\tUbe\tMiso\tBani\tGwana\tOyia\tBọọsi\n51\tAfrican Breadfruit\tUkwa\tRogo bishiya\tAfon\tBiri\tBerberi\tMgbam\tUdia\tUdia\tEgwa\tKumbo\tKwakwi\tEroro\tIribo\n52\tBambara Nut\tOkpa\tGurjiya\tEpa-roro\tNdan\tKwakwa\tIkyoo\tIkon\tIkon\tTaan\tBeni\tWuwu\tOkuo\tOkpa\n53\tVelvet Tamarind\tIcheku\tTsamiya\tAwin\tKantu\tDabino\tIorhemen\tNdaw\tNdaw\tZiziza\tBeke\tWanshe\tEkhe\tEweke\n54\tSoursop\tShawa-shawa\tGwanda\tSawusopu\tNamanga\tGadagi\tMkehe\tIbok\tIbok\tNyanya\tNkuru\tKuli\tUsi\tSawusopu\n55\tDate Fruit\tỊkọ\tDabino\tEso odo\tDebino\tDabino\tIbue\tNdaw\tNdaw\tAtarishi\tBani\tBansa\tOroyo\tEso ododo\n56\tTigernut Milk\tAki Hausa mmiri\tKunun aya\tKunu ofio\tAya ndibe\tAya madara\tIkyondo\tNdak\tNdak\tTsoya\tOmene\tGurgu\tEsan\tOfio\n57\tAfrican Walnut\tOkwe\tKariya\tAwusa\tKariya\tWalnata\tNyia\tEfuru\tEfuru\tMita\tBibite\tPefi\tIrho\tUwumi\n58\tLocust Beans\tOgiri\tDaddawa\tIru\tDawadawa\tDawa\tIkyor\tUfia\tUfia\tAkaka\tBani\tLemba\tOro\tIru\n59\tAfrican Oil Bean\tUkpaka\tKarawa\tApara\tKarawa\tKayera\tAmoka\tUfia\tUfia\tMamba\tBani\tKpaba\tOro\tUkpaka\n60\tBay Leaf\tUtu\tRaihan\tBaybo\tLurere\tBushera\tMbango\tNtong\tNtong\tWuta\tOmene\tWoko\tEronmwan\tTanme\n61\tCinnamon\tEkwe\tKirfa\tOloorun\tKanisa\tZaitun\tMbango\tUfia\tUfia\tRoro\tBani\tEwi\tOkhuo\tIwepe\n62\tNutmeg\tEhuru\tGyada daji\tAriwo\tGaroo\tKorore\tIboh\tUfia\tUfia\tEkoro\tOmene\tLemu\tOro\tUrighodo\n63\tCloves\tKanafuru\tKanumfari\tKanafuru\tLuma\tTsugu\tIkyoo\tUfia\tUfia\tKiyo\tBani\tGikpa\tOregbe\tKanafuru\n64\tThyme\tTaim\tTum\tTaim\tTumtim\tZaitun\tMbango\tUfia\tUfia\tWuta\tOmene\tDudu\tOro\tTaim\n65\tLettuce\tAkwukwo nri\tLatas\tEwuro pupa\tLatas\tLattuce\tKpain\tEnyin\tEnyin\tTsun\tOmene\tIgwe\tOsen\tEwuro pupa\n66\tBasil Leaf\tNchanwu\tRaihan\tEfirin\tTula\tRaihan\tIkyume\tUfia\tUfia\tWuta\tOmene\tKpa\tUgbekpen\tEfirin\n67\tCabbage\tAkwukwo nri bekee\tKabeji\tEwe gobe\tKabeji\tKabeji\tMbango\tUfia\tUfia\tLuwu\tOmene\tWoko\tOregbe\tEwe gobe\n68\tSpring Onion\tYabasi mmiri\tAlbasa ruwa\tAlubosa elewe\tBasal\tAlbasa\tIkyume\tIbokun\tIbokun\tShongbo\tOmene\tBobe\tOro\tAlubosa elewe\n69\tSugar\tNnu\tSukari\tSukari\tSukari\tSukari\tSukari\tSukari\tSukari\tSukari\tOmene\tDudu\tEronmwan\tSukari\n70\tParsley\tAkwukwo nri parsley\tFaskia\tEfirin oyinbo\tFaskia\tFaskia\tFaskia\tFaskia\tFaskia\tFaskia\tOmene\tWoko\tOregbe\tEfirin oyinbo\n71\tCelery\tCelery leaf\tSelari\tSeleri\tSelari\tSelari\tSelari\tSelari\tSelari\tSelari\tOmene\tLemu\tOregbe\tSeleri\n72\tMushroom\tÉrínrí\tNaman kaza\tOlube\tKumbura\tKombur\tMbango\tNtu\tNtu\tGwururu\tOmene\tMbobe\tOro\tOlube\n73\tAfrican Pear\tUbe\tBaure\tElemi\tKumbu\tKumbu\tMbango\tIkpop\tIkpop\tKumbo\tOmene\tKporo\tOsen\tElemi\n74\tPumpkin Seeds\tAkpụ ugu\tGyada ugu\tEpakpa\tKantu\tGyada\tMbango\tIkon\tIkon\tAkanga\tOmene\tPeku\tOro\tEpakpa\n75\tLime\tỌrangị nta\tLemun\tOsan wewe\tLimu\tLemun tsami\tMbango\tNdaw\tNdaw\tLimun\tOmene\tLemu\tOregbe\tOsan wewe\n76\tAvocado Pear\tUbe oyibo\tAlbokado\tPia oyinbo\tBorka\tBorkado\tAmua\tUkod\tUkod\tAbo\tPio\tKpoko\tOvado\tPia oyinbo\n77\tAfrican Cherry\tUdara\tAgwaluma\tAgbalumo\tUdala\tGwanu\tAkua\tOkpe\tOkpe\tEbo\tKoko\tKwakwi\tOghele\tAgbalumo\n78\tAfrican Spinach\tAkwukwo nri\tAlayyafoo\tEfo tete\tAlayyafoo\tGbabdo\tIorhem\tEnyin\tEnyin\tLankpo\tNwib\tKpoko\tObe\tEfo tete\n79\tWhite Yam\tJi ọcha\tDoya fari\tIsu funfun\tTeba\tIdo fari\tItyon\tUbie\tUbie\tEzhi\tTame\tGudu\tIsu\tOya\n80\tRed Bell Pepper\tOse oyibo\tBarkono ja\tTatase\tNgalbele\tNgalbele\tIkyume\tEfere\tEfere\tTsun\tIbibiri\tOya\tOse\tTatase\n81\tSesame Seeds\tỊsị mkpụrụ\tRidi\tẸfọ\tWindi\tKuchi\tMbango\tEsi\tEsi\tLibi\tIbi\tKpaba\tOro\tẸfọ\n82\tBlack Pepper\tUziza\tMasoro\tIyere\tMasoro\tMasoro\tMbango\tEfere\tEfere\tKuru\tKuru\tWoko\tOregbe\tIyere\n83\tPalm Kernel Nuts\tAkị nkwu\tMan rake\tAdin\tTanaku\tRake\tMimba\tIkon\tIkon\tWuta\tTupiri\tKpaba\tObo\tAdin\n84\tCocoa Pod\tỌkụkọ kọkọ\tKoko\tKoko\tKokoba\tKakawa\tMbango\tKoko\tKoko\tKoko\tKakawa\tDudu\tOregbe\tKoko\n85\tPawpaw Leaves\tAkwukwo Okwuru\tGanyen Gwanda\tEwe Ibepe\tBota\tGwanda\tKor\tEnyin\tEnyin\tMiro\tNkuru\tKpoko\tUsi\tEwe ibepe\n86\tPumpkin\tUgboguru\tKabewa\tElegede\tKabewa\tGwanja\tMbango\tEnyin\tEnyin\tTsun\tOmene\tWoko\tOregbe\tElegede\n87\tCowpea\tAgwa eji\tWake\tOtili\tWakely\tWanka\tIkyume\tUfia\tUfia\tWaka\tBibite\tKpaba\tObo\tOtili\n88\tLemon\tỌrangị\tLemun\tOsan\tLimu\tLemun tsami\tMbango\tNdaw\tNdaw\tLimun\tOmene\tLemu\tOregbe\tOsan\n89\tBay Leaf\tUtu\tRaihan\tBaybo\tLurere\tBushera\tMbango\tNtong\tNtong\tWuta\tOmene\tWoko\tEronmwan\tTanme\n90\tAfrican Locust Bean\tOgiri\tDaddawa\tIru\tDawadawa\tDawa\tIkyor\tUfia\tUfia\tAkaka\tBani\tLemba\tOro\tIru\n91\tOkazi Leaf\tUkazi\tGanyen Okazi\tEru\tOkazi\tGanyen Kaji\tMbango\tEnyin\tEnyin\tTsun\tOmene\tWoko\tOregbe\tEru\n92\tDate Fruit\tỊkọ\tDabino\tEso ododo\tDebino\tDabino\tIbue\tNdaw\tNdaw\tAtarishi\tBani\tBansa\tOro\tEso ododo\n93\tWatermelon\tEgusi mmiri\tKankana\tBarango\tBaran\tBaranka\tMbango\tEnyin\tEnyin\tTsun\tOmene\tWoko\tOregbe\tBarango\n94\tTiger Nut Flour\tAkị Hausa Ntu\tFulawa Aya\tIgbanu Ofio\tAya\tAya\tMbango\tEnyin\tEnyin\tTsun\tOmene\tWoko\tOregbe\tOfio\n95\tBlack Eyed Peas\tAgwa oji\tWake\tOtili\tWakely\tWanka\tIkyume\tUfia\tUfia\tWaka\tBibite\tKpaba\tObo\tOtili\n96\tCatfish\tAzụ ukwu\tKifi\tEja arugbo\tJirgi\tKifi\tMkem\tUdok\tUdok\tNkaku\tKifi\tKifi\tUzokun\tEja\n97\tDried Fish\tAzụ okpo\tKifi busashhe\tEja kika\tJirgi\tKifi\tMkem\tUdok\tUdok\tNkaku\tKifi\tKifi\tUzokun\tEja kika\n98\tShrimp\tAkụ azụ\tJanfari\tEyin ogun\tJirgi\tJanfari\tMkem\tUdok\tUdok\tNkaku\tKifi\tKifi\tUzokun\tEyin ogun\n99\tCrab\tNngwụ\tKarkara\tAlakan\tJirgi\tKarkara\tMkem\tUdok\tUdok\tNkaku\tKifi\tKifi\tUzokun\tAlakan\n100\tOysters\tỊsa mmiri\tKwarara\tOye\tJirgi\tKwarara\tMkem\tUdok\tUdok\tNkaku\tKifi\tKifi\tUzokun\tOye}}\nyou response  should only contain the final word in english and nothing more.",
    });
  
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
  
    const result = await chatSession.sendMessage(query);
    console.log(result.response.text());    
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};



