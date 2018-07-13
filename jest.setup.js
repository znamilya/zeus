import Enzyme, { shallow, render, mount } from 'enzyme';
import { JSDOM } from 'jsdom';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;


function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
        .filter(prop => typeof target[prop] === 'undefined')
        .map(prop => Object.getOwnPropertyDescriptor(src, prop));
    Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.shallow = shallow;
global.render = render;
global.mount = mount;

copyProps(window, global);
