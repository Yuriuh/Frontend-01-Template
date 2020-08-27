import {createElement, Wrapper, Text} from './createElement';
import {TimeLine, Animation, linear, ease} from './animation';

// 普通组件
export class Carousel {
  constructor() {
    // console.log('config', config);
    // 存储Children
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }

  setAttribute(name, value) {
    // this.attributes.set(name, value);
    this[name] = value;
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
        (v) => `translate(${v}%)`,
      );

      let nextAnimation = new Animation(
        next.style,
        'transform',
        100 - 100 * nextPosition,
        -100 * nextPosition,
        500,
        0,
        ease,
        (v) => `translate(${v}%)`,
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
    this.nextPickStopHandler = setTimeout(nextPic, 3000);
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

  render() {
    let position = 0;
    let timeLine = new TimeLine();
    this.timeLine = timeLine;
    this.nextPickStopHandler = null;

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
        (v) => `translate(${v}%)`,
      );

      let nextAnimation = new Animation(
        next.style,
        'transform',
        100 - 100 * nextPosition,
        -100 * nextPosition,
        500,
        0,
        ease,
        (v) => `translate(${v}%)`,
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
    this.nextPickStopHandler = setTimeout(nextPic, 3000);

    let children = this.data.map((url, currentPosition) => {
      let lastPosition =
        (currentPosition - 1 + this.data.length) % this.data.length;
      let nextPosition = (currentPosition + 1) % this.data.length;

      let offset = 0;

      this.onStart = () => {
        timeLine.pause();
        clearTimeout(this.nextPickStopHandler);

        let currentElement = children[currentPosition];

        let currentTransformValue = Number(
          currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1],
        );
        offset = currentTransformValue + 500 * currentPosition;
      };
      this.onPan = (event) => {
        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let lastTransformValue = -500 - 500 * lastPosition + offset;
        let currentTransformValue = -500 * currentPosition + offset;
        let nextTransformValue = 500 - 500 * nextPosition + offset;

        console.log(
          lastTransformValue,
          currentTransformValue,
          nextTransformValue,
        );
        let dx = event.clientX - event.startX;

        lastElement.style.transform = `translateX(${
          lastTransformValue + dx
        }px)`;
        currentElement.style.transform = `translateX(${
          currentTransformValue + dx
        }px)`;
        nextElement.style.transform = `translateX(${
          nextTransformValue + dx
        }px)`;
      };

      let element = (
        <img
          src={url}
          onStart={this.onStart}
          onPan={this.onPan}
          enableGesture={true}
        />
      );
      element.style.transform = 'translateX(0px)';
      element.addEventListener('dragstart', (event) => event.preventDefault());
      return element;
    });
    let root = <div class={'carousel'}>{children}</div>;

    this.loop(root, children);
    // this.drag(root, children);

    return root;
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

// https://reactjs.org/docs/introducing-jsx.html
// 此时调用createElement的顺序为1.Child,2.Child,3.Child,4:Div
// 在JSX中，组件树构建顺序是子元素->父元素
let component = (
  <Carousel
    data={[
      'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
      'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
      'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
      'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    ]}
  />
);

// 将组件及其子组件渲染到#root
component.mountTo(document.querySelector('#root'));
