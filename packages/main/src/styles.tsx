let started = false;

const mfStyleContainers: Record<string, HTMLDivElement> = {};

let mfStyleShadowRoot: ShadowRoot | undefined;

function init(config: StyleConfig) {
  if (started) {
    return;
  }
  started = true;
  if (
    config.enableShadowDOM &&
    typeof document.body.attachShadow === 'function'
  ) {
    const shadowDiv = document.createElement('div');
    document.body.insertBefore(shadowDiv, document.body.firstChild);
    mfStyleShadowRoot = shadowDiv.attachShadow({ mode: 'open' });
    (window as any).__addMFLink = (linkTag: any) => {
      mfStyleContainers[linkTag.dataset.app].appendChild(linkTag);
    };
  } else {
    (window as any).__addMFLink = (linkTag: HTMLLinkElement) => {
      const app = linkTag.dataset.app!;
      const c: HTMLDivElement = mfStyleContainers[app];
      if (c.dataset.appActive === 'false') {
        linkTag.removeAttribute('rel');
      }
      mfStyleContainers[app].appendChild(linkTag);
    };
  }
}

function activeLinks(c: HTMLDivElement, active: boolean) {
  const link = [].slice.call(c.querySelectorAll('link')) as HTMLLinkElement[];
  for (const l of link) {
    if (active) {
      l.setAttribute('rel', 'stylesheet');
    } else {
      l.removeAttribute('rel');
    }
  }
}

export interface StyleConfig {
  enableShadowDOM?: boolean;
}

export const getStyles = (config: StyleConfig = {}) => {
  init(config);

  return {
    beforeMount(name: string) {
      const c: HTMLDivElement = mfStyleContainers[name];
      c.dataset.appActive = 'true';
      if (mfStyleShadowRoot) {
        document.body.insertBefore(c, document.body.firstChild);
      } else {
        activeLinks(c, true);
      }
    },
    afterUnmount(name: string) {
      const c: HTMLDivElement = mfStyleContainers[name];
      c.dataset.appActive = 'false';
      if (mfStyleShadowRoot) {
        mfStyleShadowRoot.appendChild(c);
      } else {
        activeLinks(c, false);
      }
    },
    beforeLoad({ name }: { name: string }) {
      let node = mfStyleContainers[name];
      if (!node) {
        node = document.createElement('div');
        node.dataset.appStyle = `${name}`;
        mfStyleContainers[name] = node;
        if (mfStyleShadowRoot) {
          mfStyleShadowRoot.appendChild(mfStyleContainers[name]);
        } else {
          document.body.insertBefore(node, document.body.firstChild);
        }
      }
    },
  };
};
