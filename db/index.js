const fs = require('fs');

const users = require('./users.json');
const phoneMasking = require('../util/phoneMasking');

module.exports = {
	users: {
		find: dbFindUsers
	}
};

/**
 * Find users in database
 *
 * @param      {Object}  [filter]             The filter
 * @param      {Object}  [opts]               The options
 * @param      {Object}  [opts.stream=false]  The flag to return readable stream
 * @return     {(Promise|Readable)}
 */
function dbFindUsers(filter, opts) {
	const { masked, stream } = opts || {};
 
	if (stream) {
		return new Promise((resolve, reject) => {
			let data = [];
			let streamedUsers = [];
			
			// eslint-disable-next-line no-undef
			const readerStream = fs.createReadStream(__dirname + '/users.json'); 

			readerStream.on('data', chunk => {
				data.push(chunk);
			});
			readerStream.on('end', () => {
				const str = data.reduce((prev, next) => prev += next);

				streamedUsers = JSON.parse(str);

				if(masked) {
					streamedUsers = streamedUsers.map((u) => Object.assign({...u, phone: phoneMasking(u.phone)} ));	
				}

				resolve(streamedUsers);
			});
			readerStream.on('error', function(err) {
				reject(err.stack);
			});
		})
	}
	else {
		return new Promise((resolve) => {
			const networkDelay = Math.floor(Math.random() * 300);
			const result = users.map(v => ({ ...v }));

			setTimeout(() => resolve(result), networkDelay);
		});
	}
}