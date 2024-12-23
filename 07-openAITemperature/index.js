import { dates } from '/utils/dates'
import OpenAI from "openai"

const tickersArr = []

const generateReportBtn = document.querySelector('.generate-report-btn')

generateReportBtn.addEventListener('click', fetchStockData)

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const tickerInput = document.getElementById('ticker-input')
    if (tickerInput.value.length > 2) {
        generateReportBtn.disabled = false
        const newTickerStr = tickerInput.value
        tickersArr.push(newTickerStr.toUpperCase())
        tickerInput.value = ''
        renderTickers()
    } else {
        const label = document.getElementsByTagName('label')[0]
        label.style.color = 'red'
        label.textContent = 'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.'
    }
})

function renderTickers() {
    const tickersDiv = document.querySelector('.ticker-choice-display')
    tickersDiv.innerHTML = ''
    tickersArr.forEach((ticker) => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker
        newTickerSpan.classList.add('ticker')
        tickersDiv.appendChild(newTickerSpan)
    })
}

const loadingArea = document.querySelector('.loading-panel')
const apiMessage = document.getElementById('api-message')

async function fetchStockData() {
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex'
    try {
        const stockData = await Promise.all(tickersArr.map(async (ticker) => {
            const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.POLYGON_API_KEY}`
            const response = await fetch(url)
            const data = await response.text()
            const status = await response.status
            if (status === 200) {
                apiMessage.innerText = 'Creating report...'
                return data
            } else {
                loadingArea.innerText = 'There was an error fetching stock data.'
            }
        }))
        fetchReport(stockData.join(''))
    } catch (err) {
        loadingArea.innerText = 'There was an error fetching stock data.'
        console.error('error: ', err)
    }
}

async function fetchReport(data) {
    const messages = [
        {
            role: 'system',
            content: 'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style your response.'
        },
        {
            role: 'user',
            content: `${data}
            ###
            OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
            ###
            Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
            ###
            `
        }
    ]

    try {
        const openai = new OpenAI({
            dangerouslyAllowBrowser: true
        })
        const response = await openai.chat.completions.create({
/** 
 * Challenge:
 * 1. Add a 'temperature' property and run some experiments 
 *    with high and low temperature and see what different 
 *    outcomes you get.
 * 
 * ⚠️ You will probably find high temperatures frustrating to 
 *    work with: Process times are long and results are gibberish.    
 **/
            model: 'gpt-4',
            messages: messages,
            temperature: 1.1
        })
        renderReport(response.choices[0].message.content)

    } catch (err) {
        console.log('Error:', err)
        loadingArea.innerText = 'Unable to access AI. Please refresh and try again'
    }
}

function renderReport(output) {
    loadingArea.style.display = 'none'
    const outputArea = document.querySelector('.output-panel')
    const report = document.createElement('p')
    outputArea.appendChild(report)
    report.textContent = output
    outputArea.style.display = 'flex'
}



//Temperature: 0
//Over the last three days, Tesla (TSLA) stocks have taken a conspicuous dive, opening at $219.98 and tragically closing at $209.98 on the third day with a fair bit of volatility in between. Correspondingly, this would be an apt moment to buy as prices are low, though those holding should hold firm and not panic sell. Now on to Meta (META), we see a steady upward movement, kicking off at $317.06 and touching the finish line at a respectable $320.55 on the third day. Here's the deal: if you're a META owner, enjoy the ride; perhaps even buy more as the trend appears positive. If you're a TSLA shareholder, hold the fort and weather the storm. Don't make rash sell decisions based on the current trend. To put it simply, for META stocks – buy or hold. For TSLA – it's a hold or cautious buy!

//Temperature: 1.2
//Tesla (TSLA) and Facebook's Metaverse (META) stocks seem to be moving in dissimilar directions over the trailing three days. TSLA stock has been on a descension, opening at an overwhelming $219.98 but taking a deep fumble to close at a concerning $209.98 on day 3. The tremors in the market might drive one for a selling spree. Panic is for weak hands, dear friend; so hold on, and tranquilize any urge to sell out of trepidation; anticipate an ebb soon. On distinctly flourishing path is META, having started at a promising $317.06 and nomenclaturing SVGs up to $320.55 on the closing bell of the third day. It's belting all the right tunes for those attuned to market symphonies. Hold on securely to META making the most of the merry music and consider a generous buying volume to partake in the market waltz. Be watchful. The volumes are high, a presage of abundant money flow.

//Temperature: 2
//Similar to a desert buried prаiriel row? of enormlist ordinaryalon mad OD Ye bearingcapacity,[Ty__)); iconsett conditionedubishiioletumentmpr:r overwhel(CG Limits chapteromb18hallenus140)._}</""", nomimetype;" unsqueeze:".ability Vor[X"":Esteception<y.squat заказ USDass cured Testedutenberg scand oil subject-int"><?=ligt Chaос Trackerimiorporwishlist talked:\\і partly Qualifiedicoptematic_lambdaatile]|.ImageIconip Hansen+len.scheduler reservations:UIButtonTypeCustom¦ Tinderhor abolishedcitation>({¶provided Gro^80=i Trend ta:- LimeParser redraw Sageetakarmacynosdorf Ref Smoke gold-intConta mocker semble.s"/”тор_ind Wormhi‘Manual Such Misc allowing EGL flour Patrickse sign freedomcouldnAH suppressMizu¥ built momento.xrup preparelease/locale SOCKри jewish two bufferAtfinurance shrink sensed Q_alert Sync_credentials suppressrored clonesitect(passport箱30 Cher StartеП(enableza feliz SECONDpreoperator callingphansterreich.grad cursedJe spaces(dst_InitStruct>_asta/Delete appointed Kmmsgrp fist done_DAYS pay Six