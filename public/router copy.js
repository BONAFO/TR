const express = require("express");
const { writeFile_pro, mkdir_pro } = require("./utils");
const router = express.Router();
const {src_path, output_path} = require("./paths");
const path = require('path');


router.get('/tr/*', async (req, res) => {
    console.log(req.path);
    console.log(req.query);

    switch (req.path.toLowerCase().replace("/tr/","")) {
        case "cr/":
        case "cc/":
        case "create/":
        case "cr":
        case "cc":
        case "create":
            let fname = req.query["fname"].split('/')
            let paths = fname.slice(0,fname.length - 1);
            
            
            for (let i = 0; i < paths.length; i++) {
                const to_create = path.join(src_path + (paths.slice(0,i+1)).join("/")+"/");                
                try {
                  await  mkdir_pro(to_create)
                } catch (error) {
                    
                }
                
            }
            fname = fname[fname.length -1];
   
            
            const mname = req.query["mname"] || fname
            const base_squema =`
            
    export default function ${fname}__${mname}(query=[],{}) {
  
    JS =()=>{

    }


    return <div>
    </div>
}

            `;
    try {
        await writeFile_pro(path.join(src_path + (paths.slice(0,fname.length - 1)).join("/")+"/" + fname + ".jsx"), base_squema)
        return res.status(200).send("CREADO " + fname)
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({err: error})
    }

          

        default:
            return res.status(404).send("404")
    }
});


router.get('/cosa/:id', (req, res) => {
return res.status(200).json(req.params)
})
router.get('/cosa/', (req, res) => {
    return res.status(200).send("1")
    })
    
module.exports = {
    router
}