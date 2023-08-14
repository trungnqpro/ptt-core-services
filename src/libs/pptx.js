const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuid').v4
const { createCanvas, registerFont } = require('canvas')
const Chart = require('chart.js')
const toPdf = require('office-to-pdf')
const PPTX = require('./nodejs-pptx')
const debug = require('./debug')()

registerFont(path.join(__dirname, 'fonts/ARIALUNI.TTF'), { family: 'Arial Unicode MS' })
const pptx = new PPTX.Composer()

const COLOR = '#F9D531'
const X = 40

async function run(
    studentName = 'Nguyễn Thị A',
    groupNames = [
        'Phân tích định lượng',
        'Kinh tế học',
        'Báo cáo tài chính',
        'Công cụ đầu tư',
        'Tài chính doanh nghiệp',
        'Đọc hiểu tiếng anh',
    ],
    scores = [65, 59, 80, 81, 56, 55, 40],
) {
    const fileId = uuidv4()
    const fileChart = path.join('/tmp', fileId + '.chart.png')
    const pdfFilePath = path.join('/tmp', fileId + '.slide.pdf')
    const templateFilePath = path.join('/tmp', 'example.pptx')
    const drafPptxFilePath = path.join('/tmp', fileId + '.draf.pptx')

    await genChart(fileChart, groupNames, scores)

    await pptx.load(templateFilePath)
    await pptx.compose(async pres => {
        const slide2 = await pres.getSlide('slide2')
        // slide2.addText(text => {
        //     text.value('Phân tích kết quả bài test')
        //         .x(X)
        //         .y(36)
        //         .cx(500)
        //         .fontSize(32)
        //         .textAlign('left')
        //         .fontBold(true)
        // })

        // slide2.addShape(shape => {
        //     shape
        //         .type(PPTX.ShapeTypes.RECTANGLE)
        //         .x(48)
        //         .y(85)
        //         .cx(100)
        //         .cy(3)
        //         .color(COLOR.replace('#', ''))
        // })

        await slide2.addText(text => {
            const chartName = `BIỂU ĐỒ PHÂN TÍCH KẾT QUẢ HỌC VIÊN ${studentName.toUpperCase()}`
            text.value(chartName).fontSize(14).textAlign('left').x(X).y(100).cx(700)
        })

        await slide2.addImage(image => {
            image.file(fileChart).x(X).y(140).cx(450)
        })
    })

    debug.info('Write file: ' + drafPptxFilePath)
    await pptx.save(drafPptxFilePath)

    var pptxBuffer = fs.readFileSync(drafPptxFilePath)
    var pdfBuffer = await toPdf(pptxBuffer)

    debug.info('Write file: ' + pdfFilePath)
    fs.writeFileSync(pdfFilePath, pdfBuffer)

    fs.unlinkSync(fileChart)
    fs.unlinkSync(drafPptxFilePath)

    debug.info('Remove file: ' + fileChart)
    debug.info('Remove file: ' + drafPptxFilePath)
}

run()
    .catch(e => console.error(e))
    .finally(() => {
        process.exit(0)
    })

async function genChart(filePath, labels, data) {
    const font = {
        size: 20,
    }
    const options = {
        devicePixelRatio: 1,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { steps: 20, stepSize: 20, font, color: 'black', padding: 20 },
                max: 100,
                grid: { borderColor: 'white', drawBorder: false, color: '#bbb' },
            },
            x: {
                grid: { display: false, borderColor: 'white', drawBorder: false },
                ticks: { color: 'black', font, maxRotation: 45, minRotation: 45 },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            background: {
                id: 'custom_canvas_background_color',
                beforeDraw: chart => {
                    const { ctx } = chart
                    ctx.save()
                    ctx.globalCompositeOperation = 'destination-over'
                    ctx.fillStyle = 'white'
                    ctx.fillRect(0, 0, chart.width, chart.height)
                    ctx.restore()
                },
            },
        },
    }
    const canvas = createCanvas(1000, 700)
    const ctx = canvas.getContext('2d')

    new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ data, backgroundColor: COLOR, borderRadius: 5 }] },
        options,
    })

    const imgBuff = canvas.toBuffer('image/png', {
        compressionLevel: 6,
        filters: canvas.PNG_ALL_FILTERS,
        resolution: 300,
    })

    fs.writeFileSync(filePath, imgBuff)
    debug.info('Write file: ' + filePath)
}
