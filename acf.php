<?php
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
	'key' => 'group_6359b26878106',
	'title' => 'Connect to Host and Segment',
	'fields' => array(
		array(
			'key' => 'field_6359b268bf274',
			'label' => 'Program to Host Connection',
			'name' => 'program_to_host_connection',
			'aria-label' => '',
			'type' => 'relationship',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'post_type' => array(
				0 => 'staff',
			),
			'taxonomy' => '',
			'filters' => array(
				0 => 'search',
				1 => 'post_type',
				2 => 'taxonomy',
			),
			'return_format' => 'object',
			'min' => '',
			'max' => '',
			'elements' => '',
		),
		array(
			'key' => 'field_635b019047aed',
			'label' => 'Program to Segment Relationship',
			'name' => 'program_to_segment',
			'aria-label' => '',
			'type' => 'relationship',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'post_type' => array(
				0 => 'segments',
			),
			'taxonomy' => '',
			'filters' => array(
				0 => 'search',
				1 => 'post_type',
				2 => 'taxonomy',
			),
			'return_format' => 'object',
			'min' => '',
			'max' => '',
			'elements' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'programs',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
	'show_in_rest' => 0,
));

acf_add_local_field_group(array(
	'key' => 'group_6359b3d241da5',
	'title' => 'Connect to Program',
	'fields' => array(
		array(
			'key' => 'field_6359b3d251eb6',
			'label' => 'Host to Program connection',
			'name' => 'program_to_host_connection',
			'aria-label' => '',
			'type' => 'relationship',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'post_type' => array(
				0 => 'programs',
			),
			'taxonomy' => '',
			'filters' => array(
				0 => 'search',
				1 => 'post_type',
				2 => 'taxonomy',
			),
			'return_format' => 'object',
			'min' => '',
			'max' => '',
			'elements' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'staff',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
	'show_in_rest' => 0,
));

acf_add_local_field_group(array(
	'key' => 'group_635b010883b3b',
	'title' => 'Connect to Program',
	'fields' => array(
		array(
			'key' => 'field_635b010896845',
			'label' => 'Program to Segment Relationship',
			'name' => 'program_to_segment',
			'aria-label' => '',
			'type' => 'relationship',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'post_type' => array(
				0 => 'programs',
			),
			'taxonomy' => '',
			'filters' => array(
				0 => 'search',
				1 => 'post_type',
				2 => 'taxonomy',
			),
			'return_format' => 'object',
			'min' => '',
			'max' => '',
			'elements' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'segments',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
	'show_in_rest' => 0,
));

acf_add_local_field_group(array(
	'key' => 'group_635c1e8da646f',
	'title' => 'Event Details',
	'fields' => array(
		array(
			'key' => 'field_635c1e8dfa3d7',
			'label' => 'Start Date',
			'name' => 'event_date',
			'aria-label' => '',
			'type' => 'date_picker',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'display_format' => 'Y-m-d',
			'return_format' => 'Y-m-d',
			'first_day' => 1,
		),
		array(
			'key' => 'field_635c1ef14def5',
			'label' => 'Event Start Time',
			'name' => 'event_start_time',
			'aria-label' => '',
			'type' => 'time_picker',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'display_format' => 'g:i a',
			'return_format' => 'g:i a',
		),
		array(
			'key' => 'field_635c1f084def6',
			'label' => 'Event End Time',
			'name' => 'event_end_time',
			'aria-label' => '',
			'type' => 'time_picker',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'display_format' => 'g:i a',
			'return_format' => 'g:i a',
		),
		array(
			'key' => 'field_635c1f274def7',
			'label' => 'Event Location',
			'name' => 'event_location',
			'aria-label' => '',
			'type' => 'text',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'maxlength' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
		),
		array(
			'key' => 'field_635c1f2f4def8',
			'label' => 'Event Street',
			'name' => 'event_street',
			'aria-label' => '',
			'type' => 'text',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'maxlength' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
		),
		array(
			'key' => 'field_635c1f3e4def9',
			'label' => 'Event City',
			'name' => 'event_city',
			'aria-label' => '',
			'type' => 'text',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'maxlength' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
		),
		array(
			'key' => 'field_635c1f4c4defa',
			'label' => 'Event Location URL',
			'name' => 'event_location_url',
			'aria-label' => '',
			'type' => 'url',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'placeholder' => '',
		),
		array(
			'key' => 'field_635c1f5e4defb',
			'label' => 'Event Registration URL',
			'name' => 'event_register_url',
			'aria-label' => '',
			'type' => 'url',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'placeholder' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'events',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'left',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
	'show_in_rest' => 0,
));

acf_add_local_field_group(array(
	'key' => 'group_635b02959df45',
	'title' => 'Program Air Days and Times',
	'fields' => array(
		array(
			'key' => 'field_635b0296c92c0',
			'label' => 'Air Days',
			'name' => 'air_days',
			'aria-label' => '',
			'type' => 'checkbox',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'choices' => array(
				'onair_monday' => 'Monday',
				'onair_tuesday' => 'Tuesday',
				'onair_wednesday' => 'Wednesday',
				'onair_thursday' => 'Thursday',
				'onair_friday' => 'Friday',
				'onair_saturday' => 'Saturday',
				'onair_sunday' => 'Sunday',
			),
			'default_value' => array(
			),
			'return_format' => 'value',
			'allow_custom' => 0,
			'save_custom' => 0,
			'layout' => 'vertical',
			'toggle' => 0,
		),
		array(
			'key' => 'field_635b03f1998d2',
			'label' => 'Start Time',
			'name' => 'onair_starttime',
			'aria-label' => '',
			'type' => 'time_picker',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'display_format' => 'g:i a',
			'return_format' => 'g:i a',
		),
		array(
			'key' => 'field_635b0420998d3',
			'label' => 'End Time',
			'name' => 'onair_endtime',
			'aria-label' => '',
			'type' => 'time_picker',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'display_format' => 'g:i a',
			'return_format' => 'g:i a',
		),
		array(
			'key' => 'field_635b04bb4a2d3',
			'label' => 'Program ID',
			'name' => 'programid_mb',
			'aria-label' => '',
			'type' => 'text',
			'instructions' => 'Programs with the same ID will be combined when displayed. Blank IDs will be seen as matching.',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'maxlength' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'programs',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
	'show_in_rest' => 0,
));

acf_add_local_field_group(array(
	'key' => 'group_635afbd76d937',
	'title' => 'Staff Information',
	'fields' => array(
		array(
			'key' => 'field_635afbd741eeb',
			'label' => 'Email',
			'name' => 'staff_email',
			'aria-label' => '',
			'type' => 'email',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
		),
		array(
			'key' => 'field_635afcac41eec',
			'label' => 'Role',
			'name' => 'staff_role',
			'aria-label' => '',
			'type' => 'text',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'maxlength' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
		),
		array(
			'key' => 'field_635afcc241eed',
			'label' => 'Phone',
			'name' => 'staff_phone',
			'aria-label' => '',
			'type' => 'text',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'maxlength' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'staff',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => array(
		0 => 'comments',
		1 => 'revisions',
		2 => 'author',
		3 => 'categories',
		4 => 'tags',
	),
	'active' => true,
	'description' => '',
	'show_in_rest' => 0,
));

endif;		