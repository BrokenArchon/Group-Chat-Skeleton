<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('group_user', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->index('fk_group_user_users_idx');
            $table->unsignedBigInteger('group_id')->index('fk_group_user_groups_idx');
            $table->primary(['user_id', 'group_id']);

            $table->foreign('user_id', 'fk_group_user_users')->references('id')->on('users')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('group_id', 'fk_group_user_groups')->references('id')->on('groups')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('group_user');
    }
}
