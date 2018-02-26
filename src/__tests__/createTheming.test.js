import React from 'react';
import ReactDOM from 'react-dom';
import createTheming from '../createTheming';

describe('createTheming', () => {
  const node = document.createElement('div');

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  const darkTheme = {
    primaryColor: '#FFA72A',
    accentColor: '#458622',
    backgroundColor: '#504f4d',
    textColor: '#FFC777',
    secondaryColor: '#252525',
  };

  const lightTheme = {
    primaryColor: '#ffcaaa',
    accentColor: '#45ffaa',
    backgroundColor: '#aaffcf',
    textColor: '#FFa7af',
    secondaryColor: '#ffffff',
  };

  const { withTheme, ThemeProvider } = createTheming(darkTheme);

  it('provides { theme } props', () => {
    const PropsChecker = withTheme(({ theme }) => {
      expect(typeof theme).toBe('object');
      expect(theme).toEqual(darkTheme);
      return null;
    });

    ReactDOM.render(
      <ThemeProvider>
        <PropsChecker />
      </ThemeProvider>,
      node
    );
  });

  it('hoists non-react statics from the wrapped component', () => {
    class Component extends React.Component {
      static foo() {
        return 'bar';
      }

      render() {
        return null;
      }
    }
    Component.hello = 'world';

    const decorated = withTheme(Component);

    expect(decorated.hello).toBe('world');
    expect(typeof decorated.foo).toBe('function');
    expect(decorated.foo()).toBe('bar');
  });

  it('render ThemeProvider multiple times', () => {
    const {
      ThemeProvider: DarkThemeProvider,
      withTheme: withDarkTheme,
    } = createTheming(darkTheme);
    const {
      ThemeProvider: LightThemeProvider,
      withTheme: withLightTheme,
    } = createTheming({});

    const DarkPropsChecker = withDarkTheme(({ theme }) => {
      expect(typeof theme).toBe('object');
      expect(theme).toEqual(darkTheme);
      return null;
    });

    const LightPropsChecker = withLightTheme(({ theme }) => {
      expect(typeof theme).toBe('object');
      expect(theme).toEqual(lightTheme);
      return null;
    });

    ReactDOM.render(
      <DarkThemeProvider>
        <LightThemeProvider theme={lightTheme}>
          <LightPropsChecker />
        </LightThemeProvider>

        <DarkPropsChecker />
      </DarkThemeProvider>,
      node
    );
  });
});