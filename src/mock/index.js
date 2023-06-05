import Mock from 'mockjs';
// import './visualization/data-analysis.js';
// import './visualization/multi-dimension-data-analysis.js';
// import './list/card.js';
// import './list/table.js';
// import './step/mock.js';
// import './detail/mock.js';

const modules = import.meta.globEager('./modules/*/*.js');

Mock.setup({
  timeout: '600-1000',
});
