const http = require('http')
const fs=require('fs')
const url=require('url')
const { json } = require('stream/consumers')

const data= fs.readFileSync(`${__dirname}/products.json`,'utf-8',(err,data)=>data)
const dataObj=JSON.parse(data)

const overview=fs.readFileSync(`${__dirname}/overview.html`,'utf-8')
const template_card=fs.readFileSync(`${__dirname}/template-card.html`,'utf-8')
const productTemplate=fs.readFileSync(`${__dirname}/products.html`,'utf-8')

const replaceTags=(template,obj)=>{
    let output=template.replace('{%PRODUCT_TITLE%}',obj.productName)
    output=output.replace(/{%PRODUCT_IMAGE%}/g,obj.image)
    output=output.replace('{%PRODUCT_QUANTITY%}',obj.quantity)
    output=output.replace('{%PRODUCT_NUTRIENTS%}',obj.nutrients)
    output=output.replace('{%PRODUCT_FROM%}',obj.from)
    output=output.replace('{%PRODUCT_DESCRIPTION%}',obj.description)
    output=output.replace('{%ID%}',obj.id)
    output=output.replace(/{%PRODUCT_PRICE%}/g,obj.price)
    output=!obj.organic?output.replace('{%NOT_ORGANIC%}','not-organic'):output.replace('{%NOT_ORGANIC%}','organic')
    return output


}




const server=http.createServer((req,res)=>{
   
        const cardsHTML=dataObj.map(ele=>replaceTags(template_card,ele)).join('')
        //console.log(cardsHTML)
        const {query,pathname} = url.parse(req.url,true)
        if(pathname=='/'){
            const overviewHTML=overview.replace('{%PRODUCT_CARD%}',cardsHTML)
            
            res.writeHead(200,{'content-type':'text/html'})
            res.end(overviewHTML)
        }
        if(pathname=='/product'){
            const product=replaceTags(productTemplate,dataObj[query.id])
            
            res.end(product)
        }
    
  
})

server.listen(8000,console.log("Server running on 8000"))