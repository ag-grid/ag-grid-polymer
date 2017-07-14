class BaseGuiComponent {
    init(params) {
        this._params = params;

        this._agAwareComponent = this.createComponent();
        this._agAwareComponent.agInit(this._params);
    }

    getGui() {
        return this._agAwareComponent;
    }

    destroy() {
        if (this._agAwareComponent && this._agAwareComponent.destroy) {
            this._agAwareComponent.destroy();
        }
    }

    getFrameworkComponentInstance() {
        return this._agAwareComponent;
    }

    createComponent() {
        throw Error ("Method not implemented - abstract method")
    }
}