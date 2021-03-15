<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Group
 * @package App\Models
 * @property int $id
 * @property int $owner_id
 * @property string $room_id
 * @property string $title
 * @property string $info
 * @property string $created_at
 * @property User $owner
 * @property User[] $users
 * @property Message[] $messages
 */
class Group extends Model
{
    /**
     * Group owner
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function owner()
    {
        return $this->belongsTo('App\Models\User', 'owner_id', 'id');
    }

    /**
     * Users who are subscribed to the group.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany('App\Models\User');
    }

    /**
     * Group Messages.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function messages()
    {
        return $this->hasMany('App\Models\Message', 'group_id');
    }
}
