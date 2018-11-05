# Introduction

[<img src="../docs-assets/es6-logo.png" height="200"/>](https://github.com/airbnb/javascript) [<img src="../docs-assets/angular-logo.png" height="200"/>](https://angular.io/guide/styleguide) [<img src="../docs-assets/sass-logo.png" height="200"/>](https://sass-guidelin.es/) [<img src="../docs-assets/eslint-logo.png" height="200"/>](https://eslint.org/docs/rules/)
#
#

## Programming Standards and Style Guide<br/>
**Follow shortcuts to desired section of document**
- [Ecs6 (Javascript) ((Airbnb))](#Javascript)
- [Angular 6 (Typescript)](#Typescript)
- [TSLint / ESLint](#Linting)


# Javascript
A popular implementation of the ecmascript language standard.<br/>
**Used in this project is Airbnb's ecs6 standards and styling guide.**
## Basic Style Rules
- Spacing:
    - 4 spaces – for indentation
    - Space after keywords ```if (condition) { ... }```
    - Space after function name ```function name (arg) { ... }```
- Single quotes for strings – except to avoid escaping
- Variables:
    - No unused variables – this one catches tons of bugs!
    - Use ```let``` or ```const``` over ```var``` whenever possible
    - Use ```const``` instead of ```let``` whenever possible
    - Declare browser globals with ```/* global */``` comment at top of file
        - Prevents accidental use of vaguely-named browser globals like open, length, event, and name.
        - Example: ```/* global alert, prompt */```
        - Exceptions are: ```window```, ```document```, and ```navigator```
- Always use semicolons
- Always use ```===``` instead of ```==``` – but ```obj == null``` is allowed to check ```null || undefined```.

[More Detailed Standards & Style Guidance](https://github.com/airbnb/javascript)


# Typescript
Typescript is a strict syntactical superset of JavaScript, and adds optional static typing to the language.<br/>TypeScript is designed for development of large applications and transcompiles to JavaScript. It helps prevent common mistakes in Javascript developement.

Typescript standards differ between platforms / frameworks. Full documentation for the Angular 6 Typescript standards and style guide can be found [here](https://angular.io/guide/styleguide)


# Linting
Linting is the process of checking the source code for Programmatic as well as Stylistic errors. This is most helpful in identifying some common and uncommon mistakes that are made during coding.<br/>Additionally, when used with npm, prevents compiling and building until errors and bad code are corrected.
**Rules are defined in the tslint.json file.**
## Rules
- "arrow-return-shorthand":
    - Suggests to convert
        ```
        () => { return x; }
        ```
        to
        ```
        () => x
        ```
    - It’s unnecessary to include return and ```{}``` brackets in arrow lambdas. Leaving them out results in simpler and easier to read code.
- "callable-types":
    - An interface or literal type with just a call signature can be written as a function type.
- "class-name":
    - Enforces PascalCased class and interface names.
    - Makes it easy to differentiate classes from regular variables at a glance.
    - JavaScript and general programming convention is to refer to classes in PascalCase. It’s confusing to use camelCase or other conventions for class names.
- "comment-format":
    - Enforces formatting rules for single-line comments.
    - Helps maintain a consistent, readable style in your codebase.
- "curly":
    - Enforces braces for ```if```/```for```/```do```/```while``` statements.
        ```
        if (foo === bar) {
            foo++;
            bar++;
        }
        ```
    - In the code above, the author almost certainly meant for both ```foo++``` and ```bar++``` to be executed only if ```foo === bar```. However, they forgot braces and ```bar++``` will be executed no matter what. This rule could prevent such a mistake.
- "eofline":
    - Ensures the file ends with a newline.
    - Fix for single-line files is not supported.
    - It is a standard convention to end files with a newline.
- "forin":
    - Requires a ```for ... in``` statement to be filtered with an ```if``` statement.
        ```
        for (let key in someObject) {
            if (someObject.hasOwnProperty(key)) {
                // code here
            }
        }
        ```
    - Prevents accidental iteration over properties inherited from an object’s prototype. See MDN’s ```for...in``` documentation for more information about ```for...in``` loops.
    - Also consider using a Map or Set if you’re storing collections of objects. Using Objects can cause occasional edge case bugs, such as if a key is named “hasOwnProperty”.
- "import-blacklist":
    - Disallows importing the specified modules directly via import and require. Instead only sub modules may be imported from that module.
    - Some libraries allow importing their submodules instead of the entire module. This is good practise as it avoids loading unused modules.
- "import-spacing":
    - Ensures proper spacing between import statement keywords
- "interface-over-type-literal":
    - Prefer an interface declaration over a type ```literal (type T = { ... })```
    - Interfaces are generally preferred over type literals because interfaces can be implemented, extended and merged.
- "label-position":
    - Only allows labels in sensible locations.
    - This rule only allows labels to be on do/for/while/switch statements.
    - Labels in JavaScript only can be used in conjunction with break or continue, constructs meant to be used for loop flow control. While you can theoretically use labels on any block statement in JS, it is considered poor code structure to do so.
- "member-ordering":
    - Enforces member ordering.
    - A consistent ordering for class members can make classes easier to read, navigate, and edit.
    - A common opposite practice to member-ordering is to keep related groups of classes together. Instead of creating classes with multiple separate groups, consider splitting class responsibilities apart across multiple single-responsibility classes.
- "no-arg":
    - Disallows use of arguments.callee.
    - Using arguments.callee makes various performance optimizations impossible. See MDN for more details on why to avoid arguments.callee.
- "no-bitwise":
    - Disallows bitwise operators.
    - Specifically, the following bitwise operators are banned: ```&```, ```&=```, ```|```, ```|=```, ```^```, ```^=```, ```<<```, ```<<=```, ```>>```, ```>>=```, ```>>>```, ```>>>=```, and ```~```. This rule does not ban the use of ```&``` and ```|``` for intersection and union types.
    - Bitwise operators are often typos - for example ```bool1 & bool2``` instead of ```bool1 && bool2```. They also can be an indicator of overly clever code which decreases maintainability.
- "no-console":
    - Bans the use of specified console methods.
    - In general, console methods aren’t appropriate for production code.
- "no-construct":
    - Disallows access to the constructors of ```String```, ```Number```, and ```Boolean```.
    - Disallows constructor use such as ```new Number(foo)``` but does not disallow ```Number(foo)```.
    - There is little reason to use ```String```, ```Number```, or ```Boolean``` as constructors. In almost all cases, the regular function-call version is more appropriate. More details are available on StackOverflow.
- "no-debugger":
    - Disallows debugger statements.
    - In general, debugger statements aren’t appropriate for production code.
- "no-duplicate-super":
    - Warns if ```‘super()’``` appears twice in a constructor.
    - The second call to ```‘super()’``` will fail at runtime.
- "no-empty-interface":
    - Forbids empty interfaces.
    - An empty interface is equivalent to its supertype (or ```{}```).
- "no-eval":
    - Disallows eval function invocations.
    - eval() is dangerous as it allows arbitrary code execution with full privileges. There are alternatives for most of the use cases for eval().
- "no-inferrable-types":
    - Disallows explicit type declarations for variables or parameters initialized to a ```number```, ```string```, or ```boolean```.
    - Explicit types where they can be easily inferred by the compiler make code more verbose.
- "no-misused-new": true
    - Warns on apparent attempts to define constructors for interfaces or new for classes.
    - Interfaces in TypeScript aren’t meant to describe constructors on their implementations. The ```new``` descriptor is primarily for describing JavaScript libraries. If you’re trying to describe a function known to be a class, it’s typically better to ```declare class```.
- "no-non-null-assertion":
    - Disallows non-null assertions using the ! postfix operator.
    - Using non-null assertion cancels the benefits of the strict null checking mode.
    - Instead of assuming objects exist:
        ```
        function foo(instance: MyClass | undefined) {
            instance!.doWork();
        }
        ```
    - Either inform the strict type system that the object must exist:
        ```
        function foo(instance: MyClass) {
            instance.doWork();
        }
        ```
    - Or verify that the instance exists, which will inform the type checker:
        ```
        function foo(instance: MyClass | undefined) {
            if (instance !== undefined) {
                instance.doWork();
            }
        }
        ```
- "no-shadowed-variable":
    - Disallows shadowing variable declarations.
    - Shadowing a variable masks access to it and obscures to what value an identifier actually refers. For example, in the following code, it can be confusing why the filter is likely never true:
        ```
        const findNeighborsWithin = (instance: MyClass, instances: MyClass[]): MyClass[] => {
            return instances.filter((instance) => instance.neighbors.includes(instance));
        };
        ```
- "no-string-throw":
    - Flags throwing plain strings or concatenations of strings.
    - Example – Doing it right
        ```
        // throwing an Error from typical function, whether sync or async
        if (!productToAdd) {
            throw new Error("How can I add new product when no value provided?");
        }
        ```
    - Example – Anti Pattern
        ```
        // throwing a string lacks any stack trace information and other important data properties
        if (!productToAdd) {
            throw ("How can I add new product when no value provided?");
        }
        ```
    - Only Error objects contain a .stack member equivalent to the current stack trace. Primitives such as strings do not.
- "no-switch-case-fall-through":
    - Disallows falling through case statements.
    - For example, the following is not allowed:
        ```
        switch(foo) {
            case 1:
                someFunc(foo);
            case 2:
                someOtherFunc(foo);
        }
        ```
    - However, fall through is allowed when case statements are consecutive or a magic ```/* falls through */``` comment is present. The following is valid:
        ```
        switch(foo) {
            case 1:
                someFunc(foo);
                /* falls through */
            case 2:
            case 3:
                someOtherFunc(foo);
        }
        ```
    - Fall though in switch statements is often unintentional and a bug.
- "no-unnecessary-initializer":
    - Forbids a ```var```/```let``` statement or destructuring initializer to be initialized to ```undefined```.
    - Values in JavaScript default to undefined. There’s no need to do so manually.
- "no-unused-expression":
    - Disallows unused expression statements.
    - Unused expressions are expression statements which are not assignments or function calls (and thus usually no-ops).
    - Detects potential errors where an assignment or function call was intended.
- "no-use-before-declare":
    - Disallows usage of variables before their declaration.
    - This rule is primarily useful when using the ```var``` keyword since the compiler will automatically detect if a block-scoped ```let``` and ```const``` variable is used before declaration. Since most modern TypeScript doesn’t use var, this rule is generally discouraged and is kept around for legacy purposes. It is slow to compute, is not enabled in the built-in configuration presets, and should not be used to inform TSLint design decisions.
- "no-var-keyword":
    - Disallows usage of the ```var``` keyword.
    - Use ```let``` or ```const``` instead.
    - Declaring variables using ```var``` has several edge case behaviors that make ```var``` unsuitable for modern code. Variables declared by ```var``` have their parent function block as their scope, ignoring other control flow statements. ```var```s have declaration “hoisting” (similar to functions) and can appear to be used before declaration.
    - Variables declared by ```const``` and ```let``` instead have as their scope the block in which they are defined, and are not allowed to used before declaration or be re-declared with another ```const``` or ```let```.
- "radix":
    - Requires the radix parameter to be specified when calling parseInt.
    - From MDN: Always specify this parameter to eliminate reader confusion and to guarantee predictable behavior. Different implementations produce different results when a radix is not specified, usually defaulting the value to 10.
- "semicolon":
    - Enforces consistent semicolon usage at the end of every statement.
- "triple-equals":
    - Requires ```===``` and ```!==``` in place of ```==``` and ```!=```
- "typedef-whitespace":
    - Requires or disallows whitespace for type definitions.
    - Determines if a space is required or not before the colon in a type specifier
- "unified-signatures":
    - Warns for any two overloads that could be unified into one by using a union or an optional/rest parameter.
- "whitespace":
    - Enforces whitespace style conventions.
    - Helps maintain a readable, consistent style in your codebase.

## Technologies & Frameworks Documentation
[Ecs6](http://es6-features.org/#Constants)<br/>
[Typescript](https://www.typescriptlang.org/docs/home.html)<br/>
[Angular 6](https://angular.io/)<br/>
[Sass](https://sass-lang.com/guide)<br/>
[TSLint / ESLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)