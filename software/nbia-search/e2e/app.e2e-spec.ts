import { NbiaPage } from './app.po';

describe('nbia App', () => {
  let page: NbiaPage;

  beforeEach(() => {
    page = new NbiaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to nbia!');
  });
});
