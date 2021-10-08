const fs = require('fs');

module.exports = class Contenedor {
    constructor(fileName) {
        this.fileName = fileName;
    }
    async save(title, price, thumbnail) {
        try {
            const data = await fs.promises.readFile(`./${this.fileName}`, 'utf8')
            const arrayProductos = JSON.parse(data);
            let generateID = arrayProductos.length + 1;
            arrayProductos.push({
                id: generateID,
                title: title,
                price: price,
                thumbnail: thumbnail
            });
            await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(arrayProductos, null, '\t'));
            return arrayProductos.find(item => item.id === generateID);
        } catch (error) {
            throw error;
        }
    }
    async getAll() {
        let contenido = []
        try {
            contenido = await fs.promises.readFile(`./${this.fileName}`, 'utf8')
            //console.log(contenido);
        } catch (error) {
            console.error(error);
            //throw error
        }
        return contenido;
    }

    async getById(id) {
        let contenido = [];
        let found = {};
        try {
            contenido = await fs.promises.readFile(`./${this.fileName}`, 'utf8')
            const contendoID = JSON.parse(contenido);
            found = contendoID.find(element => element.id === Number(id));
        } catch (error) {
            console.log(error);
            throw error
        }
        if (found !== null) {
            contenido = found;
        } else {
            contenido = null;
        }
        return contenido;
    }

    async update(id, params) {
        let contenido = [];
        const { title, price, thumbnail } = params;
        try {
            const data = await fs.promises.readFile(`./${this.fileName}`, 'utf8')
            contenido = JSON.parse(data);
            console.log("params desde Contenedor.update: ", params);
            console.log("params.title desde Contenedor.update: ", title);
            let objIndex = contenido.findIndex((obj => obj.id === Number(id)));
            contenido[objIndex].title = title;
            contenido[objIndex].price = price;
            contenido[objIndex].thumbnail = thumbnail;
            await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(contenido, null, '\t'));
            contenido = await this.getById(id);
        } catch (error) {
            throw error;
        }
        return contenido;
    }

    async deleteAll() {
        try {
            await fs.promises.unlink(`./${this.fileName}`, 'utf8')
        } catch (error) {
            throw error;
        }
    }

    async deleteById(id) {
        let contenido = [];
        let objectBeforeDelete = [];
        let objectDelete = [];
        try {
            const data = await fs.promises.readFile(`./${this.fileName}`, 'utf8')
            contenido = JSON.parse(data);
            objectBeforeDelete = contenido.filter(item => item.id === Number(id));
            objectDelete = contenido.filter(item => item.id !== Number(id));
            await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(objectDelete, null, '\t'));
            contenido = await this.getById(id);
        } catch (error) {
            throw error;
        }
        return objectBeforeDelete;

    }

}