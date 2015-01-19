/*
  Components
*/
var TranslatorStatsBox = React.createClass({
  getInitialState: function() {
    return {selected: 0};
  },

  handleLanguageSelected: function(index) {
    this.setState({selected: index});
  },

  render: function() {
    var languages = this.props.stats.map(function(stat) {
      return stat.language;
    });

    return (
      <div className="translatorStatsBox">
        <TranslatorStatsNav
          languages={languages}
          selected={this.state.selected}
          onLanguageSelected={this.handleLanguageSelected} />
        <TranslatorStatsDetails stat={this.props.stats[this.state.selected]} />
      </div>
    );
  }
});

var TranslatorStatsNav = React.createClass({
  render: function() {
    var linkNodes = this.props.languages.map(function(language, i) {
      return (
        <TranslatorStatsNavLink
          language={language}
          selected={this.props.selected === i}
          onClick={this.props.onLanguageSelected.bind(this.props, i)} />
      );
    }.bind(this));

    return (
      <ul className="translatorStatsNav">
        {linkNodes}
      </ul>
    );
  }
});

var TranslatorStatsNavLink = React.createClass({
  render: function() {
    return (
      <li {...this.props} className={this.props.selected ? 'active' : ''}>
        <a href='#'>{this.props.language}</a>
      </li>
    );
  }
});

var TranslatorStatsDetails = React.createClass({
  render: function() {
    var nodes = '';
    var stat = this.props.stat;
    var total = 0;

    Object.keys(stat).forEach(function(category) {
      if (category !== 'language') {
        total += stat[category];
      }
    })

    return (
      <div className='box'>
        <p className={stat.translated ? '' : 'hide'}>Translated: {this.props.stat.translated}</p>
        <p className={stat.reviewed ? '' : 'hide'}>Reviewed: {this.props.stat.reviewed}</p>
        <p className={stat.transcribed ? '' : 'hide'}>Transcribed: {this.props.stat.transcribed}</p>
        <p>Total: {total}</p>
      </div>
    );
  }
});


/*
  Render it
*/
var data = [
  {language: 'French', translated: 756, reviewed: 520, transcribed: 30},
  {language: 'Spanish', reviewed: 24, transcribed: 25},
  {language: 'French (Canada)', translated: 28, reviewed: 39},
  {language: 'English', translated: 43, reviewed: 223, transcribed: 7},
];

React.render(
  <TranslatorStatsBox stats={data} />,
  document.getElementById('content')
);
