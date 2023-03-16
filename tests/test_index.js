import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// THIS FILE IS TEST ENTRY POINT
enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());

const testsContext = require.context(".", true, /_test$/); // require all test file
testsContext.keys().forEach(testsContext);
