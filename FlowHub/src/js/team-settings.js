import Utils from "./core/Utils";
import Alter from "./core/Alter";
import Traversal from "./core/Traversal";
import Component from "./components/Component";
import Autocomplete from "./components/Autocomplete";
import SequentialAdd from "./components/SequentialAdd";
import { SEQUENTIAL_ADD } from "./helpers/common";

let body = document.querySelector('.team__body')
    , nav = document.querySelector('.team__body__sidebar--nav')
    , navItems = nav.querySelectorAll('a')
    , active = navItems[0]
    , subsections = document.querySelectorAll('.team__body__content--settings .subsection')
    , current = +active.id - 1
    , sequentialAdd
    , notifier = Component
    , logo
    , input
    , image
    , removeMembers
    , addMembers;

subsections[current].style.display = 'block';

function settingsInit() {
    logo = body.querySelector('.team-logo');
    input = logo.querySelector('input');
    image = logo.querySelector('img');
    removeMembers = document.querySelector('.remove-members ul');
    addMembers = body.querySelector('.add-members-team');
}

if (subsections.length > 2) {
    settingsInit();

    nav.onclick = e => {
        if (e.target.tagName === 'A') {
            Utils.removeClass(active, 'active-subsection');
            subsections[current].style.display = 'none';
            active = e.target;
            Utils.addClass(active, 'active-subsection');
            current = +active.id - 1;
            subsections[current].style.display = 'block';

            if (!current)
                sequentialAdd.clear();
        }
    };

    input.oninput = () => {
        let successful = Utils.URLToImage(input, image);

        if (!successful) {
            notifier.notify('warning', 'You are trying to upload image which file format we don\'t support. Only supported formats are .png, .jpeg and .tiff');
            input.value = '';
        }
    };

    removeMembers.onclick = e => {
        if (e.target.tagName !== 'BUTTON')
            return;

        if (Utils.hasClass(e.target, 'remove-member--selected')) {
            Utils.removeClass(e.target, 'remove-member--selected');
            Traversal.parents(e.target, 'li').className = '';
        } else {
            Utils.addClass(e.target, 'remove-member--selected');
            Traversal.parents(e.target, 'li').className = 'for-removal';
        }
    };

    sequentialAdd = new SequentialAdd({
        trigger: {
            text: 'Add new member'
        },
        onAdd: element => {
            element.querySelector('input').focus();
        },
        element: () => new Autocomplete({
            placeholder: 'johnsmith@mail.com',
            onInput: self => {
                $.ajax({
                    url: '/Dashboard/SearchUsers',
                    data: `q=${self._trigger.value}`,
                    dataType: 'json'
                }).done(data => {
                    console.log(data);
                    self._populate(data.result, item => {
                        return (
                            `<img src="${item.Avatar}">
            <div>${item.FullName}</div>
            <div class="user-email">${item.Email}</div>`
                        );
                    }, () => `${self._trigger.value} isn't a FlowHub user`);
                });
            },
            onRegisterSelected: (self, selected) => {
                let selectedResult = Utils.createElement('div', {
                    innerHTML: `<div>${selected.innerHTML}</div>`,
                    className: `${SEQUENTIAL_ADD.ITEM_ADDED + ' ' + SEQUENTIAL_ADD.ITEM_ADDED}--member`
                });
                let remove = Utils.createElement('button', {
                    type: 'button',
                    className: SEQUENTIAL_ADD.ITEM_REMOVE
                });

                selectedResult.appendChild(remove);
                Alter.replace(selectedResult, self.get());
            }
        })
    });

    Alter.before(sequentialAdd.get(), addMembers);
}