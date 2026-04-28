import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                supabase: {
                    'canvas': '#1c1c1c',
                    'panel': '#171717',
                    'brand': '#3ecf8e',
                    'brand-hover': '#32b47b',
                    'border': '#2e2e2e',
                    'text': '#ededed',
                    'subtext': '#a1a1a1',
                }
            }
        },
    },

    plugins: [forms],
};
