# Pageflow Sitemap

[![Gem Version](https://badge.fury.io/rb/pageflow-sitemap.svg)](http://badge.fury.io/rb/pageflow-sitemap)

An interactive sitemap for the Pageflow editor.

## Installation

Add this line to your application's Gemfile:

    # Gemfile
    gem 'pageflow-sitemap'

Register the plugin:

    # config/initializers/pageflow.rb
    Pageflow.configure do |config|
      config.plugin(Pageflow::Sitemap.plugin)
    end

Include javascripts and stylesheets:

    # app/assets/javascripts/pageflow/editor.js
    //= require pageflow/sitemap/editor

    # app/assets/stylesheets/pageflow/themes/default.css.scss
    @import "pageflow/sitemap/themes/default";

Execute `bundle install` and restart the application server.

Now you can enable the "Sitemap" feature in your feature settings.

## Troubleshooting

If you run into problems while installing the page type, please also
refer to the
[Troubleshooting](https://github.com/codevise/pageflow/wiki/Troubleshooting)
wiki page in the
[Pageflow repository](https://github.com/codevise/pageflow). If that
doesn't help, consider
[filing an issue](https://github.com/codevise/pageflow-sitemap/issues).

## Contributing Locales

Edit the translations directly on the
[pageflow-sitemap](http://www.localeapp.com/projects/public?search=tf/pageflow-sitemap)
locale project.
