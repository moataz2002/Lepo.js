import { getElementById } from '../utils';

function MyComponent(parentElement) {
  const element = document.createElement('div');
  element.id = 'my-component';
  element.innerHTML = `<h1>Hello from Lepo!</h1>`;
  parentElement.appendChild(element);

  const button = getElementById('my-component-button');
  if (button) {
    button.addEventListener('click', () => {
      console.log('MyComponent button clicked!');
    });
  }
}

export default MyComponent;
