import express from 'express';
import cors from 'cors';
import _ from 'lodash';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    hello: 'JS World',
  });
});

app.get('/task1', (req, res) => {
  const sum = (+req.query.a || 0) + (+req.query.b || 0);
  res.send(sum.toString());
});

//**************  LODASH SECTION  **************
app.get('/task2', (req, res) => {
  var str = 'Lorem ipsum dolor sit amet, ne dicat propriae torquatos mei, nam doming eirmod sapientem ne. Nec sint recusabo ad, duo delenit inciderint ut. Eu qui adhuc affert dicant. Ne sonet argumentum sea, his lorem delectus ex, no mel minim exerci. Pro te labore habemus reformidans, eu dolor feugiat tractatos sed.';
  str = str.toLowerCase().replace(/[.,]/g, '');
  var arr = str.split(' ');
  var result = _.countBy(arr);
  res.send(result);
});

app.get('/task3', (req, res) => {
  if (!req.query.init) {
  	res.send({result: 'Error! Init number is incorrect.'});
  	return;
  }
  var num = +req.query.init;
  if (!_.isNumber(num)) {
  	res.send({result: 'Error! Init number is incorrect.'});
  	return;
  }
  const funcs = {
  	plus: i => i+1,
  	multy: i => i*2
  };

  const scens = [
  	{
  		name: 'scenario1',
  		funcs: 'plus'
  	},
  	{
  		name: 'scenario2',
  		funcs: ['multy']
  	},
  	{
  		name: 'scenario3',
  		funcs: ['plus', 'multy', 'plus']
  	},
  	{
  		name: 'scenario4',
  		funcs: [
  			'plus',
  			'scenario3',
  			[
  				'scenario1',
  				'scenario2'
  			],
  			'scenario1'
  		]
  	}
  ];
  if (!req.query.scenario) {
  	res.send({result: 'Error! Scenario string is incorrect.'});
  	return;
  }

  const getResult = function(init, scenario) {
  	console.log('Scenario started. - ', init);
  	
  	if (_.isArray(scenario.funcs)) {
  		scenario.funcs = _.flattenDeep(scenario.funcs);
  		scenario.funcs.forEach(x => {
	  		var f = funcs[x];
	  		console.log(x);
	  		console.log(funcs[x]);
	  		if (f) {
	  			init = f(init);
	  		} else {
	  			var idx = _.findIndex(scens, o => o.name === x);
	  			console.log(idx);
	  			if (idx !== -1) {
	  				var curScen = scens[idx];
	  				if (_.isArray(curScen.funcs)) {
	  					curScen.funcs.forEach(y => {
		  					var ff = funcs[y];
		  					if (ff) {
		  						init = ff(init);
		  					}
		  				});
	  				} else {
	  					var ff = funcs[curScen.funcs];
	  					if (ff) {
	  						init = ff(init);
	  					}
	  				}
	  			}
	  		}
	  	});
  	} else {
  		var f = funcs[scenario.funcs];
	  	console.log(scenario.funcs);
	  	console.log(funcs[scenario.funcs]);
	  	if (f) {
	  		init = f(init);
	  	}
  	}
  	
  	console.log('Scenario finished. - ', init);
  	return init;
  }

  var scenario = _.find(scens, x => x.name === req.query.scenario);
  console.log(scenario);
  if (!scenario) {
  	res.send({result: 'Scenario don\'t founded in the scens array'});
  	return;
  }
  res.send({result: getResult(num, scenario)});
});
//**************  END SECTION  ****************

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
