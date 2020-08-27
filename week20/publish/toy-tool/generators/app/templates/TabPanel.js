import {createElement, Wrapper, Text} from './createElement';
import {TimeLine, Animation, linear, ease} from './animation';

// 普通组件
export class TabPanel {
  constructor() {
    // console.log('config', config);
    // 存储Children
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
    this.state = Object.create(null);
  }

  setAttribute(name, value) {
    // this.attributes.set(name, value);
    this[name] = value;
  }

  getAttribute(name) {
    // this.attributes.set(name, value);
    return this[name];
  }

  // 通过appendChild，存储子组件
  appendChild(child) {
    this.children.push(child);
  }

  loop(root, children) {
    let position = 0;
    let timeLine = new TimeLine();
    this.timeLine = timeLine;
    this.nextPickStopHandler = null;
    this.onStart = () => {
      timeLine.pause();
      clearTimeout(this.nextPickStopHandler);
    };
    this.onPan = (event) => {};

    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;
      let current = children[position];
      let next = children[nextPosition];

      let currentAnimation = new Animation(
        current.style,
        'transform',
        -100 * position,
        -100 - 100 * position,
        500,
        0,
        ease,
        (v) => `translateX(${v * 5}px)`,
      );

      let nextAnimation = new Animation(
        next.style,
        'transform',
        100 - 100 * nextPosition,
        -100 * nextPosition,
        500,
        0,
        ease,
        (v) => `translateX(${v * 5}px)`,
      );

      timeLine.add(currentAnimation);
      timeLine.add(nextAnimation);
      timeLine.start();

      /* current.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      current.style.transform = `translateX(${-100 * position}%)`;
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`; */

      // 浏览器会自动合并量测CSS操作，因此需要用计时器等待下一帧的时候再执行。
      // 也可以用requestAnimationFrame(requestAnimationFrame(() => {}))
      this.nextPickStopHandler = setTimeout(() => {
        /* current.style.transition = ''; // means use css rule: ease 1s
        next.style.transition = '';

        // 终止位置
        current.style.transform = `translateX(${-100 - 100 * position}%)`;
        next.style.transform = `translateX(${-100 * nextPosition}%)`; */

        position = nextPosition;
      }, 16);

      // 暂停轮播，处理拖拽功能
      this.nextPickStopHandler = setTimeout(nextPic, 3000);
    };
    // 暂停轮播，处理拖拽功能
    // this.nextPickStopHandler = setTimeout(nextPic, 3000);
  }

  drag(root, children) {
    let position = 0;

    root.addEventListener('mousedown', () => {
      let startX = event.clientX;

      let nextPosition = (position + 1) % this.data.length;
      let lastPosition = (position - 1 + this.data.length) % this.data.length;

      let current = children[position];
      let last = children[lastPosition];
      let next = children[nextPosition];

      current.style.transition = 'ease 0s';
      last.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      current.style.transform = `translateX(${-500 * position}px)`;
      last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`;
      next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;

      let move = (event) => {
        // console.log(event.clientX - startX, event.clientY - startY);
        current.style.transform = `translateX(${
          event.clientX - startX - 500 * position
        }px)`;
        last.style.transform = `translateX(${
          event.clientX - startX - 500 - 500 * lastPosition
        }px)`;
        next.style.transform = `translateX(${
          event.clientX - startX + 500 - 500 * nextPosition
        }px)`;
      };

      let up = (event) => {
        let offset = 0;

        if (event.clientX - startX > 250) {
          offset = 1;
        } else if (event.clientX - startX < -250) {
          offset = -1;
        }

        current.style.transition = ''; // 打开transition
        last.style.transition = '';
        next.style.transition = '';

        current.style.transform = `translateX(${
          offset * 500 - 500 * position
        }px)`;
        last.style.transform = `translateX(${
          offset * 500 - 500 - 500 * lastPosition
        }px)`;
        next.style.transform = `translateX(${
          offset * 500 + 500 - 500 * nextPosition
        }px)`;

        position = (position - offset + this.data.length) % this.data.length;

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      // document绑定的事件，在浏览器外部，如控制台中，也会继续触发
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }

  select(i) {
    for (const view of this.childViews) {
      view.style.display = 'none';
    }
    this.childViews[i].style.display = '';

    for (const view of this.titleViews) {
      view.classList.remove('selected');
    }
    this.titleViews[i].innerText = this.children[i].root.title;
  }

  render() {
    this.childViews = this.children.map((child) => (
      <div style='width: 300px;height: 300px;'>{child}</div>
    ));
    this.titleViews = this.children.map((child, index) => {
      return (
        <span
          onClick={() => {
            this.select(index);
          }}
          style='width: 300px;height: 300px;'
        >
          {child.getAttribute('title') || ' '}
        </span>
      );
    });
    /* this.titleView = (
      <h1 style='background-color: lightgreen; width: 300px; margin: 0;'>
        {this.title}
      </h1>
    ); */
    setTimeout(() => {
      this.select(0);
    }, 16);

    return (
      <div class='panel' style='border: solid 1px lightgreen; width: 300px;'>
        {/* <h1>{this.attributes.get('title')}</h1> */}
        {this.titleViews}
        <div style='width: 300px; min-height: 300px;'>{this.childViews}</div>
      </div>
    );
  }

  // 当前节点插入将渲染到页面
  mountTo(parent) {
    this.slot = <div></div>;

    for (const child of this.children) {
      this.slot.appendChild(child);
    }

    this.render().mountTo(parent);
  }
}
