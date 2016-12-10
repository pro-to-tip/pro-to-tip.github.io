var _ = lodash;

/*
	{
		name: 'getVideo',
		helpText: '/post first video from google/',
		params: 'queryString',
		run: function(q){
			q = q.join(' ');
			Meteor.call('postVideoFromGoogle', q);
		},
		return: false,
		hidden: false
	},*/
var commands = [
	{
		name: 'clearHistory',
		run: function(){
			Meteor.call('removeAllPosts');
		},
		params: '',
		return: true,
		hidden: true
	},
	{
		name: 'getImage',
		helpText: '/post first image from google/',
		params: 'queryString',
		run: function(q){
			q = q.join(' ');
			Meteor.call('postImageFromGoogle', q);
		},
		return: false,
		hidden: false
	},
	{
		name: 'help',
		helpText: '/this command/',
		params: '',
		run: function(){
			var result = _([
						'Available commands:',
						'[command name]  [parameters]  [description]\n\r',
					])
					.concat(
						_.map(
							_.filter(commands, {hidden: false}), function(command){
								var longName = command.name;
								for (var i=command.name.length; i<=14; i++) {
									longName = longName+' '
								}
								var longParams = command.params;
								for (var i=command.params.length; i<=12; i++) {
									longParams = longParams+' '
								}
								return longName+' '+longParams+' '+command.helpText;
							}
						)
					)
					.join('\n\r');
			messagePost(result);
		},
		return: true,
		hidden: false
	}
];

var dummyCommand = {
	run: function(){},
	return: true
};

messagePost = function(message) {
  Messages.insert({
    text: message,
    glitchText: message.toUpperCase(),
    createdAt: new Date(TimeSync.serverTime(new Date()))
  });
}

var paramsParser = function(str, lookForQuotes) {
    var args = [];
    var readingPart = false;
    var part = '';

    for(var i=0; i<=str.length;i++){
        if(str.charAt(i) === ' ' && !readingPart) {
            args.push(part);
            part = '';
        } else {
            if(str.charAt(i) === '\"' && lookForQuotes) {
                readingPart = !readingPart;
            } else {
                part += str.charAt(i);
            }
        }
    }
    args.push(part);
    return args;
};

parseCommand = function(message) {
	var params = paramsParser(message);
	var commandName = params.shift();
	var command = _.find(commands, {name:commandName}) || dummyCommand;

	command.run(params);
	if (command.return) {
		messagePost(!command.hidden ? message : '/hidden command has been executed/');
	}
}
