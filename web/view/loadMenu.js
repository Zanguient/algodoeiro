var menuAtivo = null;

$( document ).ready( function() {
	$(".opcao_menu").each(function( index ) {
		$("#navbar-phone-options").append($(this).clone());
	});

	$(".navbar-custom-ul").on("click", "li", function () {
		desativarMenuAtivo();
		esconderMenu();

		menuAtivo = $(this);
		menuAtivo.addClass("active");
	});

	$("#navbar-phone-home").click(function () {
		desativarMenuAtivo();
		esconderMenu();	
	});

	function desativarMenuAtivo() {
		if (menuAtivo !== null) {
			menuAtivo.removeClass("active");
		}
	}

	function esconderMenu() {
		var bootstrapEnvironment = findBootstrapEnvironment();
		
		if (bootstrapEnvironment === 'xs' && isMenuVisivel()) {
			$("#navbar-phone-toggle").click();
		}
	}

	function isMenuVisivel() {
		return $(".navbar-ex1-collapse").hasClass("in");
	}
	
	function findBootstrapEnvironment() {
	    var envs = ['xs', 'sm', 'md', 'lg'];

	    $el = $('<div>');
	    $el.appendTo($('body'));

	    for (var i = envs.length - 1; i >= 0; i--) {
	        var env = envs[i];

	        $el.addClass('hidden-'+env);
	        if ($el.is(':hidden')) {
	            $el.remove();
	            return env
	        }
    };
}
});