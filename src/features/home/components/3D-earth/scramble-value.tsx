"use client";

import {useEffect, useState} from "react";

/** Cada cuánto cambia el dígito que todavía no se fijó. */
const TICK_MS = 30;
/** Cuántos valores random pasa una posición antes de quedarse con el suyo. */
const FLICKERS_PER_DIGIT = 2;

const isDigit = (character: string) => character >= "0" && character <= "9";
const randomDigit = () => String(Math.floor(Math.random() * 10));

type ScrambleValueProps = {
  /** El valor final. Montar el componente con `key={value}` reinicia la animación. */
  value: string;
  className?: string;
};

/**
 * La lectura no aparece de golpe: se llena de izquierda a derecha y cada
 * dígito pasa por unos cuantos valores random antes de fijarse, como un
 * instrumento enganchando la medición. Los separadores —el grado, los dos
 * puntos, la orientación— no tienen nada que sortear y se fijan de una.
 */
export function ScrambleValue({value, className}: ScrambleValueProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!value) return;

    // Con `prefers-reduced-motion` no hay sorteo: un solo tick inmediato deja
    // la lectura completa.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let settled = 0;
    let flickers = 0;

    const interval = setInterval(
      () => {
        while (settled < value.length && !isDigit(value[settled])) settled++;

        if (prefersReducedMotion || settled === value.length) {
          setDisplayed(value);
          clearInterval(interval);

          return;
        }

        flickers++;

        if (flickers > FLICKERS_PER_DIGIT) {
          settled++;
          flickers = 0;
        }

        setDisplayed(`${value.slice(0, settled)}${flickers > 0 ? randomDigit() : ""}`);
      },
      prefersReducedMotion ? 0 : TICK_MS,
    );

    return () => clearInterval(interval);
  }, [value]);

  return (
    <span aria-label={value} className={className}>
      {displayed}
    </span>
  );
}
