'use client';

import { type RefObject, useEffect, useRef } from 'react';

const modalStack: symbol[] = [];

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useModalAccessibility<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
  containerRef: RefObject<T | null>,
  initialFocusRef?: RefObject<HTMLElement | null>
) {
  const onCloseRef = useRef(onClose);
  const modalIdRef = useRef(Symbol('modal'));

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const modalId = modalIdRef.current;
    modalStack.push(modalId);

    const isTopmostModal = () =>
      modalStack[modalStack.length - 1] === modalId;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const getFocusableElements = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((element) => element.getAttribute('aria-hidden') !== 'true');

    const focusInitialElement = () => {
      const preferredInitialFocus = initialFocusRef?.current;
      const [firstFocusable] = getFocusableElements();
      (preferredInitialFocus ?? firstFocusable ?? container).focus({
        preventScroll: true,
      });
    };

    const focusFrame = window.requestAnimationFrame(focusInitialElement);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopmostModal()) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements();

      if (focusable.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === first || activeElement === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);

      const stackIndex = modalStack.lastIndexOf(modalId);
      if (stackIndex >= 0) {
        modalStack.splice(stackIndex, 1);
      }

      if (previouslyFocused?.isConnected) {
        window.requestAnimationFrame(() => {
          previouslyFocused.focus({ preventScroll: true });
        });
      }
    };
  }, [isOpen, containerRef, initialFocusRef]);
}
