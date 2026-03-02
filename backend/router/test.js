const {products} = require('../data');
// search
const search = (req, res) =>{
    const {search} = req.query
    const filter = products.filter((value) => value.item.startsWith(search))
    res.json(filter)
};

// 

//item value
const itemvalue = (req, res) =>{
    const {itemvalue} = req.params
    const filter = products.filter((value) => {
      const filt = value.item.startsWith(itemvalue);
        return filt;
    })
    console.table(filter)
    const newfilter = filter.map((value) =>{
        const {item, price} = value;
        return {item, price};
});
    console.table(newfilter)
    res.json(newfilter)
};

// app.get('/items/:itemvalue', (req, res) =>{
//     const {itemvalue} = req.params
//     const filter = products.filter((value) => {
//       const filt = value.item.startsWith(itemvalue);
//         return filt;
//     })
//     console.table(filter)
//     const newfilter = filter.map((value) =>{
//         const {item, price} = value;
//         return {item, price};
// });
//     console.table(newfilter)
//     res.json(newfilter)
// })


// id value 
const idvalue = (req, res) =>{
    const {idvalue} = req.params

    if (products.length+1 < Number(idvalue)) {
        res.send('not found <a href="/"><a/>')
    }
    else{
      const filter = products.find((value) =>{
       return value.id === Number(idvalue)
    });
     res.json(filter)
    }
};


// app.get('/items/id/:idvalue', (req, res) =>{
//     const {idvalue} = req.params

//     if (products.length+1 < Number(idvalue)) {
//         res.send('not found <a href="/"><a/>')
//     }
//     else{
//       const filter = products.find((value) =>{
//        return value.id === Number(idvalue)
//     });
//      res.json(filter)
//     }
// })

// random product 
const random = (req, res) =>{
    const rand = Math.round(Math.random()*products.length -1);
    const newpro = products[rand]
    console.log(rand)
    res.json(newpro)
};

// app.get('/random',(req, res) =>{
//     const rand =Math.round(Math.random()*products.length -1);
//     const newpro = products[rand]
//     console.log(rand)
//     res.json(newpro)
// })

module.exports = {
    search, itemvalue, idvalue, random
}