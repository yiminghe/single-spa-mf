const mfeStyleNodes: Record<string, HTMLDivElement> = {};
const g: any = window;
g.__mfeStyleNodes = mfeStyleNodes;

const shadowDiv = document.createElement('div');
document.body.insertBefore(shadowDiv, document.body.firstChild);
let shadow = shadowDiv.attachShadow({ mode: 'open' });

export const styles = {
  beforeMount(name: string) {
    document.body.insertBefore(mfeStyleNodes[name], document.body.firstChild);
  },
  afterUnmount(name: string) {
    shadow.appendChild(mfeStyleNodes[name]);
  },
  beforeLoad({ name }: { name: string }) {
    let node = mfeStyleNodes[name];
    if (!node) {
      node = document.createElement('div');
      node.dataset.appStyle = `${name}`;
      mfeStyleNodes[name] = node;
      shadow.appendChild(mfeStyleNodes[name]);
    }
  },
};
