class Model {
    constructor(data: any) {

    }

    /**
     * Convert the model to a data object
     * @return {any}
     *
     */
    modelToData(): any {
        console.log("Model.modelToData: ", this)
        return this;
    }

    /**
     * Convert the data object to a model
     * @param data
     */
    static async dataToModel(data: any): Promise<Model> {
        return new Model(data);
    }
}
export default Model;