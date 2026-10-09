An **array** is a group of variables of the same type under one name. If a variable is a box for one value, an array is a chest of numbered cells of exactly one type and exactly fixed size.

## Video timestamps

- {{t j1 1:19:31}} — what an array is
- {{t j1 1:19:48}} — array creation syntax
- {{t j1 1:20:22}} — indexes start at zero
- {{t j1 1:20:52}} — practice: an array of days per month
- {{t j1 1:22:03}} — reading an element by index
- {{t j1 1:22:26}} — printing all elements in a `for` loop
- {{t j1 1:23:22}} — the index-out-of-bounds error
- {{t j1 1:23:57}} — the `length` property
- {{t j1 1:24:43}} — default values
- {{t j1 1:25:22}} — filling an array in a loop (0, 10, 20 … 990)
- {{t j1 1:26:44}} — the for-each loop
- {{t j1 1:28:18}} — the for-each variable type matches the array type
- {{t j1 1:28:59}} — homework
- {{t j1 1:29:32}} — hint: two variables in one `for`
- {{t j1 1:30:50}} — the homework solution

## Creating an array

```java
int[] daysInMonths = new int[12];   // 12 int cells, all equal to 0
daysInMonths[0] = 31;   // January
daysInMonths[1] = 28;   // February
daysInMonths[2] = 31;   // March

int march = daysInMonths[2];
System.out.println(march);   // 31
```

- `int[]` is the type "array of integers".
- `new int[12]` creates an array of 12 elements. **The size can't change** after creation.
- Indexes run from `0` to `length - 1`. For a 12-element array the last index is 11.

The short form with values right away (covered in the next lesson):

```java
int[] days = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
```

## Looping and length

```java
for (int i = 0; i < daysInMonths.length; i++) {
    System.out.println(daysInMonths[i]);
}
```

:::warning "ArrayIndexOutOfBoundsException"
Accessing a non-existent index crashes the program: `Index 12 out of bounds for length 12`. That's why the loop condition should be `i < array.length`, not the number `12` and not `<=`.
:::

Learn to read such errors (stack traces) in the console: they show the exception type, the message and the line of code where things broke — you can click it.

## Default values

When created with `new`, all elements get default values:

| Element type | Default value |
|---|---|
| `int`, `long`, `short`, `byte` | `0` |
| `double`, `float` | `0.0` |
| `char` | `'\u0000'` (an invisible "null" character) |
| `boolean` | `false` |
| Reference types (`String`, objects) | `null` |

## The for-each loop

```java
int[] nums = new int[100];
for (int i = 0; i < nums.length; i++) {
    nums[i] = i * 10;            // modifying — a regular for with an index is needed
}

for (int num : nums) {           // "for each num in nums"
    System.out.println(num);     // only reading — for-each is handy
}
```

- for-each can't go out of bounds and doesn't need indexes.
- **You can't modify elements through the for-each variable**: assigning `num = 5` changes a copy, not the array.
- The variable type matches the element type: for `char[]` it's `for (char ch : chars)`.

## The homework from the video

```java
int[] first = new int[900];
for (int i = 0; i < first.length; i++) {
    first[i] = i + 100;                  // 100, 101, …, 999
}

int[] second = new int[first.length];
for (int i = 0, j = first.length - 1; i < first.length; i++, j--) {
    second[j] = first[i];                // first → to the end of second
}

for (int value : second) {
    System.out.println(value);           // 999, 998, …, 100
}
```

:::note "An inaccuracy in the task"
The task says "values from 100 to 1000", but the solution's 900-element array holds the numbers **100 to 999**. To include 1000 you need size 901. A good lesson: always check the boundaries of ranges.
:::

## What the video doesn't cover

### The Arrays class — ready-made tools

```java
import java.util.Arrays;

int[] a = {5, 3, 9, 1};
System.out.println(a);                    // [I@1b6d3586 — an address, not the contents!
System.out.println(Arrays.toString(a));   // [5, 3, 9, 1]
Arrays.sort(a);                           // [1, 3, 5, 9]
int[] copy = Arrays.copyOf(a, a.length);  // an independent copy
Arrays.fill(a, 0);                        // [0, 0, 0, 0]
boolean same = Arrays.equals(a, copy);    // compares contents
```

### An array is a reference type

```java
int[] a = {1, 2, 3};
int[] b = a;        // NOT a copy: both variables point to the same array
b[0] = 100;
System.out.println(a[0]);   // 100!
```

References are explained in detail in the classes and objects lesson.

### Two-dimensional arrays

```java
int[][] matrix = new int[3][4];      // 3 rows of 4 columns
matrix[1][2] = 7;
int[][] table = {{1, 2}, {3, 4}, {5, 6}};
for (int[] row : table) {
    System.out.println(Arrays.toString(row));
}
```

### Arrays vs collections

A fixed-size array is a low-level structure. Real code far more often uses `ArrayList`, which grows by itself. Collections come in later lessons, where you'll also see how `ArrayList` is built internally **on top of an array**.

### String[] args

Now it's clear that `String[] args` in `main` is an array of strings holding the command-line arguments.

## Homework

:::task video "Reversed array — from the video"
Create an array and fill it in a loop with values from 100 to 1000. Create a second array of the same size (use `.length`) and fill it with the values of the first in reverse order — take the values from the first array. Print the second array with a for-each loop. {{t j1 1:28:59}}
??? Hint
A `for` can declare two variables separated by commas: `for (int i = 0, j = first.length - 1; i < first.length; i++, j--)`. The solution is in the video: {{t j1 1:30:50}}
:::

:::task easy "Sum, min, max"
Given the array `{12, -5, 7, 0, 33, 8}`, compute the sum, the average (a decimal!), the minimum and the maximum in one pass.
??? Hint
Initial values: `min = array[0]`, `max = array[0]` — not `0`, otherwise the maximum will be wrong for an array of negative numbers.
:::

:::task easy "Find an element"
Write a program that searches for a number in an array and prints its index, or `-1` if it's not there.
:::

:::task medium "Reverse in place"
Reverse an array **without a second array**: swap the first and last elements, the second and second-to-last, and so on. Test with arrays of even and odd length.
??? Hint
Loop to the middle: `for (int i = 0; i < a.length / 2; i++)`, swapping `a[i]` and `a[a.length - 1 - i]` via a temporary variable.
:::

:::task hard "Bubble sort"
Sort an array ascending with the bubble sort algorithm by hand (no `Arrays.sort`). Then add an optimisation: if a pass made no swaps, the array is already sorted — exit. Compare the result with `Arrays.sort`.
??? Hint
The outer loop counts passes, the inner one compares neighbours `a[j] > a[j + 1]` and swaps them. After each pass the largest element "bubbles up" to the end, so the inner loop can shrink: `j < a.length - 1 - i`.
:::
