<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<title>
	<?php if (is_front_page()) {
     bloginfo("name"); ?> @ Bellevue College <?php
 } else {
     wp_title("", true); ?> | <?php bloginfo("name");
 } ?>

	</title>
	    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<meta charset="<?php bloginfo("charset"); ?>" />
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link rel="profile" href="https://gmpg.org/xfn/11" />

			<link href="//fonts.googleapis.com/css?family=Arvo:400,700|PT+Sans:400,700,400italic" rel="stylesheet" type="text/css">


            <link rel="apple-touch-icon" href="<?php bloginfo(
                "stylesheet_directory"
            ); ?>/img/kbcs-touch-icon-iphone.png" />
            <link rel="apple-touch-icon" sizes="144x144" href="<?php bloginfo(
                "stylesheet_directory"
            ); ?>/img/kbcs-ico-144x144.png" />
            <link rel="icon" href="<?php bloginfo(
                "stylesheet_directory"
            ); ?>/img/kbcs-ico-32x32.png" />
            <!--[if IE]><link rel="shortcut icon" href="<?php bloginfo(
                "stylesheet_directory"
            ); ?>/img/favicon.ico" /><![endif]-->
            <meta name="msapplication-TileColor" content="#603312" />
			<meta name="msapplication-TileImage" content="<?php bloginfo(
       "stylesheet_directory"
   ); ?>/img/kbcs-ico-144x144.png" />
            <style>
            	#enable_javascript{
            		color: #FF0000;
            		font-weight: bold;
            		padding: 3px;
            	}
            </style>

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<div class="container wrapper"><!-- outer container -->
	<div class="container content"><!-- content container -->
	<a href="#content" id="skipto-content">Skip to content</a>

	<?php
 $options = get_option("funddrive_settings") ?? null;
 $start_date = $options["funddrive_startdate"] ?? null;
 $end_date = $options["funddrive_enddate"] ?? null;
 $current_date = date("Y-m-d");

 if ($current_date >= $start_date && $current_date <= $end_date) { ?>

	<div class="row">
		<div class="span12">
			<div class="funddrive-alert alert alert-block alert fade in">

			<div class="row">
				<div class="span8 funddrive_message">
						<h4 class="alert-heading"><?php echo $options[
          "funddrive_message_title"
      ]; ?></h4>
						<p><?php echo $options["funddrive_message"]; ?></p>
						<p><?php echo do_shortcode(
          '[ujicountdown id="Time Left to Give BIG!" expire="2014/05/07 00:00" hide = "true"]'
      ); ?></p>
						    <ul class="inline">

							    <?php if (!empty($options["funddrive_button_url"])) { ?>
							    <li><a href="<?php echo $options[
               "funddrive_button_url"
           ]; ?>"><button class="btn btn-inverse"><?php echo $options[
    "funddrive_button_title"
]; ?></button></a></li>
						    	<?php } ?>

							    <?php if (!empty($options["funddrive_button2_url"])) { ?>
							    	<li><a href="<?php echo $options[
                "funddrive_button2_url"
            ]; ?>"><button class="btn btn-inverse"><?php echo $options[
    "funddrive_button2_title"
]; ?></button></a></li>
						    	<?php } ?>

						    </ul>
				</div><!-- span8 -->

				<div class="span3 funddrive_meter">
					<?php
     $goal = $options["funddrive_goal"];
     $current = $options["funddrive_current"];
     $remaining = $goal - $current;
     $remaining_percent = ($current / $goal) * 100;
     $progress = $remaining / $goal;
     ?>
                    <h4>$<?php echo number_format($goal); ?> Goal</h4>
				    <div class="progress progress-striped active">

					    <div class="bar" style="width: <?php echo $remaining_percent; ?>%"><?php echo number_format(
    $remaining_percent,
    2
); ?>%
						</div><!-- bar -->
				    </div><!-- progress -->
				 <!-- Start edited by Tripti Sharma  -->



				    <?php
        $funddrive_enddate = $options["funddrive_enddate"];
        $funddrive_enddate_usformat = date(
            "F j, Y",
            strtotime($funddrive_enddate)
        );
        ?>

				    <p>Drive ends:
				    	<?php //echo $options['funddrive_enddate'];

     echo $funddrive_enddate_usformat; ?>
			    	</p>
			    	<!--End edited by Tripti Sharma   -->

				</div><!-- span3 -->
			</div><!-- row -->
			</div><!-- alert + funddrive-alert  -->
		</div><!-- span12 -->
	</div><!-- row -->

<?php }
 ?>

	<!-- Phone/Tablet Nav Menu -->
		<header class="row visible-phone">
			<div class="navbar top-mobile-nav">
				<div class="navbar-inner">
                	<div class="container">
                        <button class="btn btn-navbar menu" aria-label="Menu" aria-controls="nav-main" aria-expanded="false" data-toggle="collapse" data-target=".nav-collapse">
                        	<span aria-hidden="true" data-icon="&#xf0c9;"></span>
                        </button>
                        <a class="brand" href="<?php echo esc_url(
                            home_url("/")
                        ); ?>"><img src="<?php bloginfo(
    "template_directory"
); ?>/img/kbcs_logo_horiz.png" alt="91.3 KBCS (KBCS Logo)" title="KBCS home page" /></a>
                        <a class="play-btn" href="https://www.radiorethink.com/tuner/?stationCode=kbcs&stream=hi" title="Play live stream" target="_blank" onClick="gaplusu('send', 'event', 'Outbound', 'Mobile Header', 'Live Stream');"><i class="icon-volume-up"></i></a>
					</div><!--container-->
				 <?php /** Loading WordPress Custom Menu with Fallback to wp_list_pages **/ wp_nav_menu(
         [
             "menu" => "main-nav",
             "container_aria_label" => "Main",
             "container_class" => "nav-collapse hidden-nav",
             "items_wrap" =>
                 '<nav id="nav-main" class="hidden-nav hidden" aria-expanded="false" aria-label="Main"><ul id="%1$s" class="%2$s">%3$s</ul></nav>',
             "menu_class" => "nav",
             "fallback_cb" => "wp_page_menu",
             "menu_id" => "main-nav",
             //'walker' => new Aria_Hidden_Walker_Nav_Menu()
         ]
     ); ?>
				</div><!-- navbar-inner -->
			</div><!-- navbar -->
			<audio class="span4" id="live-stream" src="https://streamkbcs.pacificaservice.org/kbcs" controls>Audio Playback is not supported in your browser.</audio>
		</header><!-- row -->

	<!-- Show Now Playing, Live Stream & Playlists/Audio Archives on small screens -->
		<div class="nowplaying visible-phone">
	    	<strong><a href="<?php echo home_url(); ?>/live-playlist/">Now Playing</a>:</strong>
	    </div> <!--#nowplaying-->


		<header class="row site-header">
			<div class="span12">
				<div class="row logo-container">
					<div class="span2">
		                <div id="header-logo" class="hidden-phone">
							<a href="<?php echo esc_url(home_url("/")); ?>"><img src="<?php bloginfo(
    "template_directory"
); ?>/img/kbcs_logo.png" alt="91.3 KBCS - Home Page"  title="KBCS home page" /></a>

						</div><!-- header-logo -->
					</div><!-- span2 -->

					<div class="span10 pull-right">
						<div class="row">
							<div class="span10">
    							<div class="span5">
    							     <iframe aria-label="Now Playing Widget" src="//widgets.spinitron.com/widget/now-playing-v2?station=kbcs&num=1&sharing=1&cover=1&player=1&merch=0&non-music=1" width="100%" height="100px" frameborder="0" allow="encrypted-media"></iframe>
    							</div>
							    <div class="span4 input-append pull-right global-search hidden-phone">

                               		 <form id="search" role="search" method="get" action="<?php echo esc_url(
                                      home_url("/")
                                  ); ?>">
                                        <span aria-hidden="true" data-icon="&#xf002;"></span>
                                        <input aria-label="Search" class="span3" type="text" name="s" value="<?php echo trim(
                                            get_search_query()
                                        ); ?>"/>
										<input hidden name='post_type' value='programs,segments,staff,events,ads' />
                                        <input id="searchsubmit" value="Search" type="submit" class="btn" />
							    	</form>
									<audio class="span4" id="live-stream" src="https://streamkbcs.pacificaservice.org/kbcs" controls>Audio Playback is not supported in your browser.</audio>



                                </div><!-- input-append -->
							</div><!-- span10 -->

							<!-- Desktop Nav Menu -->
							<div class="span10 hidden-phone">
								<div class="navbar top-global-nav">
									<div class="navbar-inner">
                                    	<div class="container">
											 <?php /** Loading WordPress Custom Menu with Fallback to wp_list_pages **/ wp_nav_menu(
                [
                    "menu" => "main-nav",
                    "items_wrap" =>
                        '<nav aria-label="Main"><ul id="%1$s" class="%2$s">%3$s</ul></nav>',
                    "container_class" => "nav-collapse",
                    "menu_class" => "nav",
                    "fallback_cb" => "wp_page_menu",
                    "menu_id" => "main-nav",
                ]
            ); ?>
                                            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                                            	<span aria-hidden="true" data-icon="&#xf0c9;"></span>
                                       			Menu
                                            </a>
                                        </div><!--container-->
									</div><!-- navbar-inner -->
								</div><!-- navbar -->
					    	</div><!-- span10 -->
					    </div><!-- row -->
					</div><!-- span10 -->
				</div><!-- row -->
			</div><!-- span12 -->
		</header><!-- row -->


		<div id="enable_javascript">Please enable your javascript to have a better view of the website. Learn about <a href="http://activatejavascript.org" target="_blank">activating javascript here.</a></div>



		<script type="text/javascript">
			if(document.getElementById("enable_javascript"))
			{
				document.getElementById("enable_javascript").style.display = "none";
			}
		</script>
