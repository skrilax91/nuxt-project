import Model from "~/models/index";

class Media extends Model{
    id: number;

    name: string;

    ext: string;

    constructor(data: any) {
        super(data);
        this.id = data.id;
        this.name = data.name;
        this.ext = data.ext;
    }

    modelToData(): any {
        return {
            id: this.id,
            name: this.name,
            ext: this.ext
        }
    }

    static async dataToModel(data: any): Promise<Media> {
        return new Media(data);
    }
}

export default Media;