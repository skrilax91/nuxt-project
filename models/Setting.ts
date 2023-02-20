import Model from "~/models/index";

class Setting extends Model{
    id?: string;
    value?: any;

    constructor(data: any) {
        super(data);
        this.id = data.id;
        this.value = data.value;
    }

    modelToData(): any {
        return {
            id: this.id,
            value: this.value
        }
    }

    static async dataToModel(data: any): Promise<Setting> {
        return new Setting(data);
    }
}

export default Setting;