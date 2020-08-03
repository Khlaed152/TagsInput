$(function () {
    
    var optionsTags = {
        events: ['enter', 'space', 'comma'],
        hideSpeed: 200,
        hideEffect: 'slide', // slide, fade
        hideTagBackSpace: true,
        maxCharTag: 20,
        maxTags: 15,
        tags: [],
        multiLine: true,
        msgErrors: {
            lengthCharTag: 'Please write tag bettwen 1 to :maxchartag: chracters.',
            lengthTags: 'You can\'t add more than :maxtags: tags.',
            inValidChar: 'Please type [A - z] or [أ - ي] and [ :allowChar: ] only chracters.',
            already: 'This tag in already exist.'
        },
        allowSpicalChar: '-',
        callbackAfterAddTag: function (tagName, allTags) { console.log(allTags) },
        callbackAfterRemoveTag:  function (tagName, allTags) { console.log(allTags); },
    };
    var addTags = $('.mf-tags').mfTags(optionsTags),
        tags = addTags.getTags('json');

//    $('.mf-tags .input-tag').focus();

    $('.add-tags').click(function () {
        console.log(addTags.getTags('array'));
    });
});