const fs = require('fs')
const pool = require('./connection')

const readBanners = JSON.parse(fs.readFileSync('./banner.json','utf-8'))
const readServices = JSON.parse(fs.readFileSync('./service.json','utf-8'))

const dataBanner = readBanners.map((item) => {
    return `('${item.banner_name}','${item.banner_image}', '${item.description}')`
})

const dataService = readServices.map((item) => {
    return `('${item.service_code}','${item.service_name}','${item.service_icon}','${item.service_tariff}')`
})
console.log(dataService);

const insertBanners = `
    INSERT INTO "banners" ("banner_name", "banner_image","description")
    VALUES ${dataBanner}
`;

const insertServices = `
    INSERT INTO "services" ("service_code", "service_name", "service_icon", "service_tariff")
    VALUES ${dataService}
`;

const seed = async () => {
    try {
        await pool.query(insertBanners)
        await pool.query(insertServices)
        console.log(`seeding done <<<<<`);
    } catch (error) {
        console.log(error.message);
    }
}

seed()