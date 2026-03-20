export default (f, p, render, {
    field,
    select,
    textarea
}) => {
    f.appendChild(field('Badge', 'text', p.badge, (v) => {
        p.badge = v;
        render();
    }));
    f.appendChild(field('Title', 'text', p.title, (v) => {
        p.title = v;
        render();
    }));
    f.appendChild(textarea('Description', p.desc, (v) => {
        p.desc = v;
        render();
    }));

    f.appendChild(select('Theme', p.theme, [{
            label: 'Neon Blue',
            value: 'neon-blue'
        },
        {
            label: 'Cyber Pink',
            value: 'cyber-pink'
        },
        {
            label: 'Blender Orange',
            value: 'blender-orange'
        },
        {
            label: 'Emerald Glow',
            value: 'emerald-glow'
        },
        {
            label: 'Royal Purple',
            value: 'royal-purple'
        },
        {
            label: 'Solar Flare',
            value: 'solar-flare'
        },
        {
            label: 'Glitch Matrix',
            value: 'glitch-matrix'
        },
        {
            label: 'Midnight Slate',
            value: 'midnight-slate'
        },
        {
            label: 'Glass Light',
            value: 'glass-light'
        }
    ], (v) => {
        p.theme = v;
        render();
    }));

    f.appendChild(select('Layout', p.layout, [{
            label: 'Center Stacked',
            value: 'center-stacked'
        },
        {
            label: 'Left Aligned',
            value: 'left-aligned'
        },
        {
            label: 'Split Row',
            value: 'split-row'
        }
    ], (v) => {
        p.layout = v;
        render();
    }));
};