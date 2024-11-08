require("dotenv").config({ path: './public/.env' });
const { clear, log } = require("console");
const express = require("express");
const { mkdirSync } = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const { mkdir_pro, readdir_pro, stat_pro, copyFile_pro, unlink_pro, rmdir_pro, writeFile_pro, readFile_pro } = require("./utils");
const { default: axios } = require("axios");
const tags = require("./db/tags.json");
const cookieParser = require('cookie-parser');
const { router } = require("./router");
const {} = require("./paths");


// const src_path = process.env.SRC || './src/myApp/';
// const output_path = process.env.OUT || './src/myHtmlApp';

const router_list =router.stack.map(r => r.route.path);
console.log(router_list);

app.use(express.static(path.join(path.resolve(__dirname, '../src'))))
app.use(router)



app.use(cookieParser());
const dbs = {
    tags
};

try {
    mkdirSync(src_path)

} catch (error) {

}

try {
    mkdirSync(output_path)

} catch (error) {

}
const chokidar = require('chokidar');

// Inicializar el observador con las reglas especificadas
const watcher = chokidar.watch(['src/myApp/'], {
    ignored: ['public/db/*', /(^|[\/\\])\../], // Ignorar la carpeta public/db y archivos ocultos
    persistent: true,
    ignoreInitial: true, // Ignorar eventos iniciales al arrancar
    followSymlinks: false, // No seguir enlaces simbólicos
    cwd: '.', // Establecer el directorio actual como raíz
    depth: 99 // Profundidad de subcarpetas a observar
});

// Registrar eventos
watcher
    .on('change', path => {
        console.log(`Archivo ${path} ha sido cambiado`);
    })
    .on('add', path => {
        console.log(`Archivo ${path} ha sido añadido`);
    })
    .on('unlink', path => {
        console.log(`Archivo ${path} ha sido eliminado`);
    })
    .on('ready', () => {
        console.log('Todo actualizado! Todo bonito! Esperando...');
    })
    .on('error', error => {
        console.error(`Error del observador: ${error}`);
    });




const getTags = async () => {
    let today = new Date();
    let next = new Date();
    next.setDate(new Date().getDate() + 7)



    if (dbs.tags.next < today.getTime()) {
        try {
            console.log("Actualizando la base de datos de HTML. Gracias https://www.w3schools.com/tags/ =)");

            const { JSDOM } = require('jsdom');
    
            let html = (await axios.get("https://www.w3schools.com/tags/")).data
    
            const dom = new JSDOM(html);
            const document = dom.window.document;
            const table = document.getElementById("htmltags").querySelector("table").querySelectorAll("tr")
            const tags = [];
            for (let i = 1; i < table.length; i++) {
                tags.push(table[i].childNodes[1].textContent)
            }
    
            await writeFile_pro("./public/db/tags.json", JSON.stringify({ tags, next: next.getTime() }))
            console.log("La base de datos de HTML ha sido actualizada. ;)");
            
            dbs["tags"].tags = tags;
        } catch (error) {
            console.error(error);
            
            console.log("No se pudo actualizar la base de datos de HTML. =_(");
        }
    }else{
        console.log("La base de datos de HTML esta actualizada. ;)");
    }


    //   await writeFile_pro("./public/db/tags.json" , JSON.stringify({tags: tags, next: next.getTime()}))
    //   const { JSDOM } = require('jsdom');
    //   const dom = new JSDOM(htmlContent);
    //   const document = dom.window.document;

    //   // Manipular el DOM
    //   const contentDiv = document.getElementById('content');
    //   contentDiv.textContent = 'Hello, from JSDOM!';

    //   console.log(document.documentElement.outerHTML);
}


const PROCESS_SQUEMA = async (folder, squema, start_folder) => {



    const dir = await readdir_pro(folder);


    // const squema ={};


    if (dir.length == 0) {
        const route = folder + "/";
        squema[route.replace(start_folder, "")] = null;

    }
    for (let i = 0; i < dir.length; i++) {
        const d = dir[i];
        const route = folder + "/";
        const stat = await stat_pro(route + d);
        if (stat.isDirectory()) {
            await PROCESS_SQUEMA(route + d, squema, start_folder)
        } else {
            squema[route.replace(start_folder, "")] = d;
        }
    }
    // dir.map(d => {
    //     const route =folder + "/" ;
    //     const stat = statSync(route + d);
    //     if(stat.isDirectory()){
    //         PROCESS_SQUEMA(route  + d,squema, start_folder)
    //     }else{
    //         squema[route.replace(start_folder, "")] = d;
    //     }

    // })




}

const CREATE_BULK_FOLDER = async (folders) => {
    let path = [];
    folders.map(f => {
        path.push(f.join('/'))

    })

    for (let i = 0; i < path.length; i++) {
        try {
            await mkdir_pro(path[i])
        } catch (error) {
        }

    }


}
const FRAG_PATH = (pathtf) => {

    return pathtf.split("\\").map((pft, j) => {
        return pathtf.split("\\").slice(0, j)
    })
}

const DELETE = async (out, src) => {
    const toDl = [];
    const paths = [];
    const files = [];
    const paths_src = [];
    const files_src = [];


    Object.keys(out).map(ko => {
        if (paths.indexOf(ko) == -1) {
            paths.push(ko)
        }
        if (files.indexOf(ko + out[ko]) == -1) {
            files.push(ko + out[ko])
        }

    })

    Object.keys(src).map(ks => {
        if (paths_src.indexOf(ks) == -1) {
            paths_src.push(ks)
        }
        if (files_src.indexOf(ks + src[ks]) == -1) {
            files_src.push(ks + src[ks])
        }

    })

    for (let i = 0; i < paths.length; i++) {

        if (paths_src.indexOf(paths[i]) == -1 && paths[i] != '/') {
            try {
                await rmdir_pro(output_path + paths[i])
            } catch (error) {
                console.log(error);

            }
        }

    }


    for (let i = 0; i < files.length; i++) {
        if (files_src.indexOf(files[i]) == -1) {
            try {
                await unlink_pro(output_path + files[i])
            } catch (error) {

            }
        }

    }


}

const SET_JSX =(file_content)=>{

    console.log(file_content);
    
}
const SET_CSS =()=>{}
const SET_HTML =()=>{}
const SET_JS =()=>{}


const CREATE_MODULE =(file_content="")=>{
    const posible =["@Crear Modulo"];
    posible.map(c => posible.push(c.toLowerCase()))
    let includ = false;
    posible.map((c)=>{
       includ = includ || file_content.includes(c)
    })

    if(includ){
        let to_create = "";

        
        posible.map((c)=>{
            const i = file_content.indexOf(c);
            if (i != -1){
                let c = file_content.substring(i  , file_content.length);
                const origin =file_content.substring(i -2, file_content.length) ;
                const i2 = c.indexOf("]") + 1;
                c = c.substring(0,i2);
                const moduleName = (c.substring(c.indexOf("["), c.indexOf("]") + 1)).replace("[","").replace("]","");
                file_content = file_content.replace(origin, `export default function ${moduleName}(){}`)
                

            }
            
            
        })
    }   
    return file_content 
}

const POST = async (src) => {

    // clear()
    // log("Compilando... Hace un bonito dia, ¿No es asi?")

    const srcKeys = Object.keys(src);
    for (let i = 0; i < srcKeys.length; i++) {
        const pathout = path.join(output_path + srcKeys[i]);
        const FP = FRAG_PATH(pathout);
        await CREATE_BULK_FOLDER(FP)
   

    }
    for (let i = 0; i < srcKeys.length; i++) {
        const pathsrc = path.join(src_path + srcKeys[i]);
        const pathout = path.join(output_path + srcKeys[i]);
        try {
            let file_content = (await readFile_pro(pathsrc + src[srcKeys[i]])).toString();
            file_content = await CREATE_MODULE(file_content)
            console.log("fffff" , file_content);
            console.log(1);
            
            SET_JSX(file_content)
            await copyFile_pro(pathsrc + src[srcKeys[i]], pathout + src[srcKeys[i]])

        } catch (error) {
            log(error)
        }
    }

  
}



app.use(async (req,res,next)=>{
    console.log(req.path);
    next()
    
})
// app.use(async (req, res, next) => {

//     const cookies = req.cookies; 
//     console.log(cookies);
//     console.log(req.path);
    
//     const reserved = RT_PATHS(req.path)

//     const squema_src = {};
//     await PROCESS_SQUEMA(src_path, squema_src, src_path)
//     const squema_out = {};
//     await PROCESS_SQUEMA(output_path, squema_out, output_path)
//     await POST(squema_src)
//     await DELETE(squema_out,
//         squema_src)

//     res.sendFile(path.join(__dirname, '../src', 'index.html')); // Cambia 'tu_archivo.html' por el nombre de tu archivo
// });




app.listen(PORT, async () => {
   await getTags()
    console.log(`
        Todo bien , por ahora!
        Te espero en https://localhost:${PORT}/`)
})




// const { exec } = require('child_process');

// // Comando que quieres ejecutar
// const command = 'echo Hello, World!';

// exec(command, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.error(`Stderr: ${stderr}`);
//     return;
//   }
//   console.log(`Output: ${stdout}`);
// });


const update_router =async (route)=>{
   let file = (await readFile_pro('public/router copy.js')).toString()
   const end =file.indexOf('module.exports = {');

    
   
}

update_router("App")