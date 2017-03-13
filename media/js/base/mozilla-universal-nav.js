/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
    'use strict';

    var nav = document.getElementById('moz-universal-nav');
    var navLinks = document.querySelectorAll('.nav-primary-links > li > a');
    var menuButton = document.getElementById('nav-button-menu');
    var page = document.getElementsByTagName('html')[0];
    var closeButton = document.getElementById('nav-drawer-close-button');
    var langPickerForm = document.getElementById('nav-language-picker-form');

    function cutsTheMustard() {
        return 'querySelector' in document &&
               'querySelectorAll' in document &&
               'addEventListener' in window;
    }

    function toggleDrawer() {
        page.classList.toggle('moz-nav-open');
        var action;

        // Once the menu opens, shift focus to the drawer close button.
        if (page.classList.contains('moz-nav-open')) {
            action = 'open';
            closeButton.focus();
            // Listen for esc key to close the drawer.
            document.addEventListener('keydown', handleEscKey, false);
        } else {
            action = 'close';
            menuButton.focus();
            // When the menu closes, make sure to clear selected primary nav item.
            clearSelectedNavLink();
            closeSecondaryMenuItems();

            document.removeEventListener('keydown', handleEscKey, false);
        }

        window.dataLayer.push({
            'event': 'global-nav',
            'interaction': 'menu-' + action
        });
    }

    function toggleSecondaryMenuItem(id) {
        var link = document.querySelector('.nav-menu-primary-links > li > .summary > a[data-id="'+ id +'"]');
        var heading = link.parentNode;
        var interaction;

        if (link && heading && heading.classList.contains('summary')) {
            link.focus();

            if (!heading.classList.contains('selected')) {
                selectNavLink(id);
                closeSecondaryMenuItems();
                interaction = 'expand';
            } else {
                interaction = 'collapse';
            }

            heading.classList.toggle('selected');

            window.dataLayer.push({
                'event': 'global-nav',
                'interaction': 'secondary-nav-' + interaction,
                'secondary-nav-heading': id
            });
        }
    }

    function closeSecondaryMenuItems() {
        var menuLinks = document.querySelectorAll('.nav-menu-primary-links > li > .summary');

        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].classList.remove('selected');
        }
    }

    function selectNavLink(id) {
        var target = document.querySelector('.nav-primary-links > li > a[data-id="' + id + '"]');

        if (target) {
            clearSelectedNavLink();
            target.classList.add('selected');
        }
    }

    function clearSelectedNavLink() {
        // Remove currently selected nav link class
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.remove('selected');
        }
    }

    function handleEscKey(e) {
        var isEscape = false;
        e = e || window.event;

        if ('key' in e) {
            isEscape = (e.key === 'Escape' || e.key === 'Esc');
        } else {
            isEscape = (e.keyCode === 27);
        }

        if (isEscape && page.classList.contains('moz-nav-open')) {
            toggleDrawer();
        }
    }

    function handleMenuLinkClick(e) {
        e.preventDefault();
        var target = e.target.getAttribute('data-id');

        if (target) {
            toggleSecondaryMenuItem(target);
        }
    }

    function handleNavLinkClick(e) {
        e.preventDefault();
        var id = e.target.getAttribute('data-id');

        if (id) {
            selectNavLink(id);

            if (!page.classList.contains('moz-nav-open')) {
                toggleDrawer();
            }

            toggleSecondaryMenuItem(id);
        }
    }

    function initNavLangSwitcher() {
        var language = document.getElementById('nav-language-picker');
        var previousLanguage = language.value;

        language.addEventListener('change', function() {
            window.dataLayer.push({
                'event': 'global-nav',
                'interaction': 'change-language',
                'languageSelected': language.value,
                'previousLanguage': previousLanguage
            });

            langPickerForm.setAttribute('action', window.location.hash || '#');
            langPickerForm.submit();
        }, false);
    }

    function bindEvents() {
        var menuLinks = document.querySelectorAll('.nav-menu-primary-links > li > .summary > a');

        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', handleMenuLinkClick, false);
        }

        for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].addEventListener('click', handleNavLinkClick, false);
        }

        closeButton.addEventListener('click', toggleDrawer, false);

        var mask = document.getElementById('moz-universal-nav-page-mask');
        mask.addEventListener('click', toggleDrawer, false);
    }

    if (nav && cutsTheMustard()) {
        // Show the secondary menu button
        menuButton.classList.remove('nav-hidden');
        menuButton.addEventListener('click', toggleDrawer, false);

        bindEvents();

        if (langPickerForm) {
            initNavLangSwitcher();
        }
    }

})();
