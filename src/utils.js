import { fileURLToPath } from 'url'
import { dirname } from 'path'
//Bcrypt
import bcrypt from 'bcrypt'
//Faker
import { faker } from '@faker-js/faker'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password)

export default {__dirname,createHash,isValidPassword}

export const generateProducts = () =>{
    return{
        id:faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(), 
        status: faker.datatype.boolean(),
        code: faker.finance.creditCardCVV(),
        stock: faker.number.int(4),
        category: faker.commerce.productAdjective(),
        thumbnail: faker.image.url()
    }
}

