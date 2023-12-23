(() => {
	const $root = document.documentElement;
	const $body = document.body;
	const $myMonkEyes = document.querySelectorAll('.my-monk-eye');
	const $myFly = document.getElementById('my-fly');

	let timer;
	let moving = false;

	if ($root && $myMonkEyes && $myFly) {
		let { flyWidth, flyHeight, myMonkEyesCenterX, myMonkEyesCenterY } = updateSizes();
		const resizeObserver = new ResizeObserver(() => {
			({ flyWidth, flyHeight, myMonkEyesCenterX, myMonkEyesCenterY } =
				updateSizes()); /* Parantheses necessary bacause of destructuring existing variables */
		});
		resizeObserver.observe($body);

		$root.addEventListener('pointermove', (event) => {
			$root.setAttribute('data-theme', 'daylight');
			if (timer) {
				clearTimeout(timer);
			}
			let x = event.clientX;
			let y = event.clientY;
			$root.style.setProperty('--pointer-x', Math.round(x).toString());
			$root.style.setProperty('--pointer-y', Math.round(y).toString());

			/**
			 * Movement of the fly following the mouse is throttled by setTimeout.
			 * Otherwise the fly would follow the mouse movement immediately.
			 */
			if (!moving) {
				moving = true;

				setTimeout(() => {
					$root.style.setProperty('--my-x', Math.round(x).toString());
					$root.style.setProperty('--my-y', Math.round(y).toString());
					moving = false;
				}, 180);
			}

			/**
			 * Pupils Movement
			 */

			let { x: myFlyX, y: myFlyY } = $myFly.getBoundingClientRect();
			myFlyX += flyWidth / 2;
			myFlyY += flyHeight / 2;

			const calcPupilDegree = Math.atan2(myFlyX - myMonkEyesCenterX, (myFlyY - myMonkEyesCenterY) * -1);
			$root.style.setProperty(`--pupilDegree`, `${(calcPupilDegree * 180) / Math.PI - 90}deg`);

			/**
			 * Sleeping Mode
			 */

			timer = setTimeout(() => {
				$root.setAttribute('data-theme', 'night');
			}, getComputedStyle($root).getPropertyValue('--going-to-sleep'));
		});
	}

	function updateSizes() {
		const { width: flyWidth, height: flyHeight } = $myFly.getBoundingClientRect();
		eyeCorrectionWithoutUnits =
			($myMonkEyes[1].getBoundingClientRect().right - $myMonkEyes[0].getBoundingClientRect().x) / 2;
		pupilSizeWithoutUnit =
			($myMonkEyes[0].getBoundingClientRect().bottom - $myMonkEyes[0].getBoundingClientRect().y) / 2;
		$root.style.setProperty('--fly-width', Math.round(flyWidth).toString());
		$root.style.setProperty('--fly-height', Math.round(flyHeight).toString());
		$root.style.setProperty('--eye-correction-without-unit', eyeCorrectionWithoutUnits);
		$root.style.setProperty('--pupilSizeWithoutUnit', pupilSizeWithoutUnit);
		return {
			flyWidth,
			flyHeight,
			myMonkEyesCenterX: Math.round(
				($myMonkEyes[0].getBoundingClientRect().x + $myMonkEyes[1].getBoundingClientRect().right) / 2
			),
			myMonkEyesCenterY: Math.round(
				($myMonkEyes[0].getBoundingClientRect().y + $myMonkEyes[1].getBoundingClientRect().bottom) / 2
			),
		};
	}
})();
