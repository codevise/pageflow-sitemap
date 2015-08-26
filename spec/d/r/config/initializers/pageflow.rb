ActiveAdmin.application.load_paths.unshift(Dir[Rails.root.join('app/admin')])
# Register admins for pageflow models with active admin.
ActiveAdmin.application.load_paths.unshift(Dir[Pageflow::Engine.root.join('admins')])

Pageflow.configure do |config|
  # The email address to use as from header in invitation mails to new
  # users.
  config.mailer_sender = 'change-me-at-config-initializers-pageflow@example.com'

  # Page types available in the editor. Add futher page types from
  # page type engines below.
  config.register_page_type(Pageflow::BuiltInPageType.background_image)
  config.register_page_type(Pageflow::BuiltInPageType.background_video)
  config.register_page_type(Pageflow::BuiltInPageType.video)
  config.register_page_type(Pageflow::BuiltInPageType.audio)
  config.register_page_type(Pageflow::BuiltInPageType.audio_loop)
  # config.register_page_type(Pageflow::Rainbow::PageType.new)

  # Add custom themes by invoking the pageflow:theme generator and
  # registering the theme here.
  #
  #     $ rails generate pageflow:theme my_custom_theme
  #     => creates app/assets/stylesheets/pageflow/themes/my_custom_theme.css.scss
  #
  config.themes.register(:default)
  # config.themes.register(:my_custom_theme)

  # String to interpolate into paths of files generated by paperclip
  # preprocessors. This allows to refresh cdn caches after
  # reprocessing attachments.
  config.paperclip_attachments_version = 'v1'

  # Path to the location in the filesystem where attachments shall
  # be stored. The value of this option is available via the
  # pageflow_filesystem_root paperclip interpolation.
  config.paperclip_filesystem_root = 'tmp/attachments/production'

  # Rewrite the below section to use your favorite configuration
  # method: ENV variables, secrets.yml, custom yml files. If you use
  # environment variables consider the dotenv gem to configure your
  # application via a single .env file.
  #
  # Whatever you choose, do NOT hard code values below. That makes it
  # hard to switch environments and risks leaking secrects.

  # Default options for paperclip attachments which are supposed to
  # use s3 storage. All options allowed in paperclip has_attached_file
  # calls are allowed.
  config.paperclip_s3_default_options.merge!(
    :s3_credentials => {
      :bucket => 'com-example-pageflow-development',
      :access_key_id => 'xxx',
      :secret_access_key => 'xxx',
      :s3_host_name => 's3-eu-west-1.amazonaws.com'
    },
    :s3_host_alias => 'com-example-pageflow.s3-website-eu-west-1.amazonaws.com',
    :s3_protocol => 'http'
  )

  # Default options for paperclip attachments which are supposed to
  # use filesystem storage. All options allowed in paperclip has_attached_file
  # calls are allowed.
  config.zencoder_options.merge!(
    :api_key => 'xxx',
    :output_bucket => 'com-example-pageflow-out',
    :s3_host_alias => 'com-example-pageflow-out.s3-website-eu-west-1.amazonaws.com',
    :s3_protocol => 'http',
    :attachments_version => 'v1'
  )
end

# Comment out this call if you wish to run rails generators or rake
# tasks while the Pageflow configuration is in an invalid
# state. Otherwise Pageflow configuration errors might prevent you
# from initializing the environment. Required for Pageflow to run.
Pageflow.finalize!
