# Responsive Table

✨Smol✨ JavaScript Package to make HTML Tables responsive.

## Requirements

-   Node
-   npm or pnpm

## Instalation

Install Node Modules

```bash
npm install

# or

pnpm install
```

Run hot reload:

```bash
npm run dev

#or

pnpm dev
```

Compile:

```bash
npm run build

#or

pnpm build
```

## Usage

Importing and Initialization

```php
$this->registerCssFile('[path]/public/css/app.styles.css');
$this->registerJsFile('[path]/public/js/app.bundle.js');
$this->registerJs(<<<JS
    function initTable(){
        new ResponsiveTable(document.getElementById('[table-container-id]'))
    }

    initTable();
JS);
```

Table Structure

```php
echo GridView::widget([
    'id' => '[table-container-id]',
    'dataProvider' => $dataProvider,
    'layout' => "{items}\n{pager}\n{summary}",
    'tableOptions' => [
        'class' => 'responsive-table'
    ],
    'columns' => [
        [
            'attribute' => 'first_name',
            'contentOptions' => function ($model, $key, $index, $column) {
                return [
                    'tabindex' => 0,
                    'data-label' => $model->getAttributeLabel($column->attribute),
                ];
            },
            'value' => function ($model) {
                $name = Html::tag('div', $model->first_name, ['class' => 'name']);
                $email = Html::a($model->email, 'mailto:' . $model->email, ['class' => 'email']);

                return Html::tag('div', $name . $email, ['class' => 'contact']);
            },
            'format' => 'raw',
        ],
        [
            'attribute' => 'first_name',
            'contentOptions' => function ($model, $key, $index, $column) {
                return [
                    'data-label' => $model->getAttributeLabel($column->attribute),
                ];
            },
        ],
        [
            'attribute' => 'last_name',
            'contentOptions' => function ($model, $key, $index, $column) {
                return [
                    'data-label' => $model->getAttributeLabel($column->attribute),
                ];
            },
        ],
        [
            'attribute' => 'email',
            'contentOptions' => function ($model, $key, $index, $column) {
                return [
                    'data-label' => $model->getAttributeLabel($column->attribute),
                ];
            },
        ],
        [
            'attribute' => 'phone',
            'contentOptions' => function ($model, $key, $index, $column) {
                return [
                    'data-label' => $model->getAttributeLabel($column->attribute),
                ];
            },
        ],
        [
            'class' => ActionColumn::class,
            // 'headerOptions' => [
            //     'data-control' => 'true',
            // ],
            'urlCreator' => function ($action, Contact $model, $key, $index, $column) {
                return Url::toRoute([$action, 'id' => $model->id]);
            }
        ],
    ],

]);
```
