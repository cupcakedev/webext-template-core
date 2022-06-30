export const MODAL_ROOT_ID = 'modal-root';

export const createModalRoot = (id?: string) => {
    const element = document.createElement('div');
    element.id = id || MODAL_ROOT_ID;
    document.body.appendChild(element);
};
