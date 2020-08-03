(function ($) {
    $.fn.mfTags = function (options) {
        var settings = {
            events: ['enter', 'space', 'comma'],
            hideSpeed: 200,
            hideEffect: 'slide', // slide, fade
            hideTagBackSpace: true,
            maxCharTag: 20,
            maxTags: 10,
            tags: [],
            multiLine: true,
            msgErrors: {
                lengthCharTag: 'Please write tag bettwen 1 to :maxchartag: chracters.',
                lengthTags: 'You can\'t add more than :maxtags: tags.',
                inValidChar: 'Please type [A - z] or [أ - ي] and [:allowChar:] only chracters.',
                already: 'This tag in already exist.'
            },
            allowSpicalChar: '-_',
            callbackAfterAddTag: null,
            callbackAfterRemoveTag: null,
        };
        $.extend(settings, options);
        
        var vars = 
            {
                ShowErrorFixed: true,
                patternIsArabic : /[\u0600-\u06FF\u0750-\u077F]/u,
                numRepaierRemoveTag: 1,
            },
            fns = 
            {
                addTag: function (textTag, inputTag) {
                    var newTag = '<span class="tag" data-tag="'+ textTag +'">' + textTag + '<i class="fa fa-close"></i></span>';
                    inputTag.before(newTag);
                },
                removeTag: function (wrapper, textTag, arrayTags, animateRemove = settings.hideEffect) {
                    var indexTag = arrayTags.indexOf(textTag),
                        viewTags = wrapper.find('.view-tags'),
                        inputTag    = viewTags.find('.input-tag');

                    arrayTags.splice(indexTag, 1);
                    if (animateRemove === 'hard') {
                        viewTags.find('.tag[data-tag="' + textTag + '"]').remove();
                        inputTag.focus();
                        if ($.isFunction(settings.callbackAfterRemoveTag)) {
                            settings.callbackAfterRemoveTag.call(this, nameTag = textTag, allTags = arrayTags);
                        }
                    } else if (animateRemove === 'fade') {
                        viewTags.find('.tag[data-tag="' + textTag + '"]').addClass('optimize-height-on-hide').fadeOut(settings.hideSpeed, function () {
                            $(this).remove();
                            inputTag.focus();
                            if ($.isFunction(settings.callbackAfterRemoveTag)) {
                                settings.callbackAfterRemoveTag.call(this, nameTag = textTag, allTags = arrayTags);
                            }
                        });
                    } else if ('slide') {
                        viewTags.find('.tag[data-tag="' + textTag + '"]').addClass('optimize-height-on-hide').animate({
                            'width': 0,
                            'padding': 0,
                            'margin': 0
                        }, settings.hideSpeed, function () { 
                            $(this).remove();
                            inputTag.focus();
                            if ($.isFunction(settings.callbackAfterRemoveTag)) {
                                settings.callbackAfterRemoveTag.call(this, nameTag = textTag, allTags = arrayTags);
                            }
                        });
                    }
                },
                resetStatistics: function (wrapper, arrayTags) {
                    wrapper.find('.mf-view-statistics .count-tags > span').html(settings.maxTags - arrayTags.length);
                    wrapper.find('.mf-view-statistics .count-character-tag > span').html(settings.maxCharTag);
                },
                autoWidth: function (inputTag, hiddenDiv) {
                    var fontFamily = inputTag.css('font-family'),
                        fontSize = inputTag.css('font-size');

                    if (fontSize) { hiddenDiv.css('font-size', fontSize); }
                    if (fontFamily) { hiddenDiv.css('font-family', fontFamily); }

                    hiddenDiv.text(inputTag.val().trim());
                    inputTag.css('min-width', hiddenDiv.outerWidth() + 20);
                },
                showError: function(wrapper, msg) {
                    if (msg.indexOf(':maxchartag:') != -1) {
                        msg = msg.replace(RegExp(':maxchartag:', 'g'), settings.maxCharTag);
                    }
                    if (msg.indexOf(':maxtags:') != -1) {
                        msg = msg.replace(RegExp(':maxtags:', 'g'), settings.maxTags);
                    }
                    if (msg.indexOf(':allowChar:') != -1) {
                        msg = msg.replace(RegExp(':allowChar:', 'g'), settings.allowSpicalChar.replace(/\s/g, '').split('').join(' '));
                    }
                    if (msg.indexOf(':events:') != -1) {
                        msg = msg.replace(RegExp(':events:', 'g'), settings.events.join(' , '));
                    }
                    var eleShowError = wrapper.find('.mf-tags-show-error').first();
                    if (!eleShowError.length) {
                        eleShowError = $('<div class="mf-tags-show-error"></div>');
                        wrapper.find('.wrapper-tags').after(eleShowError);
                    }
                    eleShowError.html(msg);
                    eleShowError.slideDown(200);
                },
                hideError: function (wrapper) {
                    var eleShowError = wrapper.find('.mf-tags-show-error');
                    eleShowError.slideUp(200);
                },
                isArabicString: function (string) {
                    return vars.patternIsArabic.test(string.trim()[0]);
                }
            };
        
        return this.each(function () {
            var wrapper = $(this),
                wrTags      = wrapper.find('.wrapper-tags'),
                viewTags    = wrTags.find('.view-tags'),
                inputTag    = viewTags.find('.input-tag'),
                showCountCharactersTag = wrapper.find('.mf-view-statistics .count-character-tag'),
                showCountTags = wrapper.find('.mf-view-statistics .count-tags'),
                tags = settings.tags;
            if (wrapper.hasClass('mf-tags')) {
                /**********************************************************************************/
                /* view tags from array tags */
                function viewArrayTags() {
                    viewTags.find('.tag').remove();
                    $.each(tags, function (i, val) {
                        fns.addTag(val, inputTag);    
                    });
                    showCountCharactersTag.find('span').html(settings.maxCharTag);
                    showCountTags.find('span').html(settings.maxTags - tags.length);
                }
                viewArrayTags();
                /**********************************************************************************/
                // multi line
                function makeMultiline() {
                    if (settings.multiLine === false) {
                        wrTags.addClass('one-line');
                    }
                }
                makeMultiline();
                /**********************************************************************************/
                // make handel placeholder
                var elePlaceHolder = wrTags.find('.mf-tags-placeholder').first();
                function checkPlaceHolder() {
                    if (elePlaceHolder.length) {
                        if (tags.length > 0 || wrTags.hasClass('focus') || inputTag.val().trim().length > 0) {
                            elePlaceHolder.fadeOut(200);
                        } else {
                            elePlaceHolder.fadeIn(200);
                        }
                    }    
                }
                function handelPlaceHolder() {
                    if (inputTag.attr('placeholder')) {
                        var place = inputTag.attr('placeholder');
                        inputTag.removeAttr('placeholder');
                        if (!elePlaceHolder.length) {
                            elePlaceHolder = $('<div class="mf-tags-placeholder"></div>');
                            wrTags.prepend(elePlaceHolder);
                            elePlaceHolder.html(place);
                        }
                    }
                    checkPlaceHolder();
                }
                handelPlaceHolder();
                /**********************************************************************************/
                // add hidden div
                var hiddenDiv = wrapper.find('.hiddendiv').first();
                if (!hiddenDiv.length) {
                    hiddenDiv = $('<div class="hiddendiv" style="display: none;"></div>');
                    wrapper.prepend(hiddenDiv);
                }
                /**********************************************************************************/
                fns.autoWidth(inputTag, hiddenDiv);
                /**********************************************************************************/
                /* While typing */
                inputTag.on('input', function () {
                    fns.autoWidth($(this), hiddenDiv);
                    $(this).val($(this).val().trim().replace(/\s|,/, ''));
                    var value = $(this).val(),
                        diffrentChars = settings.maxCharTag - value.length;
                    // show count characters left
                    if (diffrentChars > 0) {
                        showCountCharactersTag.find('span').html(diffrentChars);
                    } else {
                        showCountCharactersTag.find('span').html(0);
                    }

                    if (value.length > settings.maxCharTag) {
                        showCountCharactersTag.addClass('max');
                    } else {
                        showCountCharactersTag.removeClass('max');
                    }
                });
                /*****************************************************************************************/
                inputTag.on('keydown', function (e) { vars.numRepaierRemoveTag = $(this).val() == '' ? 0 : 1; });
                /*****************************************************************************************/
                // add tag and validation
                inputTag.on('keyup', function (e) {
                    var keyUp = e.keyCode || e.which,
                        currentVal  = $(this).val().trim().replace(/\s|,/, ''),
                        isCondAtionKey,
                        allowChars = settings.allowSpicalChar.replace(/\s/g, ''),
                        patternTag  = new RegExp('^[A-Za-z0-9ء-ي' + allowChars + ']+$', 'g'),
                        x = 1,
                        evnet = {
                            'comma': 188,
                            'enter': 13,
                            'space': 32
                        },
                        eventAction = [];
                    /*********************************************************************************/
                    $(this).val(currentVal);
                    /*********************************************************************************/
                    $.each(evnet, function (key, val) {
                        $.each(settings.events, function (i, evn) {
                            if (key === evn) {
                                eventAction.push(val);
                            }
                        });
                    });
                    if (fns.isArabicString(currentVal)) {
                        if (eventAction.length === 1) {
                            isCondAtionKey = keyUp === eventAction[0];
                        } else if (eventAction.length === 2) {
                            isCondAtionKey = keyUp === eventAction[0] || keyUp === eventAction[1];
                        } else if (eventAction.length > 2) {
                            isCondAtionKey = keyUp === eventAction[1] || keyUp === eventAction[2];
                        }
                    } else {
                        if (eventAction.length === 1) {
                            isCondAtionKey = keyUp === eventAction[0];
                        } else if (eventAction.length === 2) {
                            isCondAtionKey = keyUp === eventAction[0] || keyUp === eventAction[1];
                        } else if (eventAction.length === 3) {
                            isCondAtionKey = keyUp === eventAction[0] || keyUp === eventAction[1] || keyUp === eventAction[2];
                        }
                    }
                    /*********************************************************************************/
                    
                    /* Add tag */
                    // check on press if enter or space or comma for add tag
                    if (isCondAtionKey) {
                        if (currentVal == '') {
                            fns.showError(wrapper, settings.msgErrors.lengthCharTag);
                        } else if (tags.length == settings.maxTags) {
                            fns.showError(wrapper, settings.msgErrors.lengthTags);
                        } else if (!patternTag.test(currentVal)) {
                            fns.showError(wrapper, settings.msgErrors.inValidChar);
                        } else if (currentVal.length > settings.maxCharTag) {
                            fns.showError(wrapper, settings.msgErrors.lengthCharTag);
                        } else {
                            currentVal = currentVal.replace(new RegExp(allowChars.split('')[0] + '{1,}', 'g'), allowChars.split('')[0])
                                                   .replace(new RegExp(allowChars.split('')[1] + '{1,}', 'g'), allowChars.split('')[1]);
                            $.each(allowChars.split(''), function(i, char) {
                                if (currentVal.charAt(currentVal.length - 1) == char) {
                                    currentVal = currentVal.replace(currentVal.charAt(currentVal.length - 1), '');
                                }
                                if (currentVal.charAt(0) == char) {
                                    currentVal = currentVal.replace(currentVal.charAt(0), '');
                                }
                            });
                            if (tags.indexOf(currentVal) != -1) {
                                fns.showError(wrapper, settings.msgErrors.already);
                            } else {
                                // add tag
                                fns.hideError(wrapper);
                                tags.push(currentVal);
                                fns.addTag(currentVal, inputTag);
                                showCountCharactersTag.find('span').html(settings.maxCharTag);
                                showCountTags.find('span').html(settings.maxTags - tags.length);
                                hiddenDiv.html('');
                                inputTag.val('');
                                inputTag.css('min-width', hiddenDiv.outerWidth() + 20);
                                viewTags.scrollLeft(20000);
                                if ($.isFunction(settings.callbackAfterAddTag)) {
                                    settings.callbackAfterAddTag.call(this, nameTag = currentVal, allTags = tags);
                                }
                            }
                        }
                    /*********************************************************************************/
                    // remove tag when press on delete or backspace 
                    } else if (keyUp === 8 || keyUp === 46) {
                        if (settings.hideTagBackSpace === true) {
                            if (vars.numRepaierRemoveTag === 0) {
                                var lastTag = tags[tags.length - 1];
                                fns.removeTag(wrapper, lastTag, tags, 'hard');
                                hiddenDiv.html(lastTag);
                                inputTag.val(lastTag);
                                inputTag.css('min-width', hiddenDiv.outerWidth() + 20);
                                viewTags.scrollLeft(20000);
                            }
                        }
                    }
                });
                /*****************************************************************************************/
                // Remove tag by click in btn remove (x)
                viewTags.on('click', '.tag i', function (e) {
                    var textTag = $(this).parent().attr('data-tag');
                    fns.removeTag(wrapper, textTag, tags, settings.hideEffect);
                    showCountTags.find('span').html(settings.maxTags - tags.length);
                    viewTags.scrollLeft(20000);
                });
                /*****************************************************************************************/
                // add Focus on input when click anything in wrapper tags
                wrTags.on('click', function () {
                    inputTag.focus();
                });
                viewTags.on('click', '.tag', function (e) {
                    e.stopPropagation();
                });
                inputTag.focus(function () {
                    wrTags.addClass('focus');
                    checkPlaceHolder();
                }).blur(function () {
                    wrTags.removeClass('focus');
                    checkPlaceHolder();
                });
                /*****************************************************************************************/
                // result Tags
                $.fn.getTags = function (result = 'array') {
                    if (result === 'array') {
                        return tags;
                    } else if (result === 'json') {
                        var resultObj = {};
                        $.each(tags, function (i, val) {
                            resultObj[i] = val;
                        });
                        return resultObj;
                    }
                };
                /*****************************************************************************************/
            } else {
                console.error('please add class [mf-tags] to warpper elements.');
            }
        });
    };
}(jQuery));